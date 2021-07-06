import React, { useState, useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import { FormControl } from "@material-ui/core";
import Datetime from "react-datetime";
import {
  Scheduler,
  WeekView,
  MonthView,
  DateNavigator,
  DayView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";

import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import { toast } from 'react-toastify';
import Skeleton from "react-skeleton";
import { makeApiCall, buildApiPath, parseScheduleDataForScheduler } from "library/AppUtilities";
import { CustomFormButton } from "views/Forms/CustomFormButton";

/** store management libs and definitions */
import { StoreManager } from "react-persistent-store-manager";
import { Stores, AppStore } from "./../../state/store";

export default function RequestSearch(props) {

  /** set user email to defaul email passed over from the main scheduler page */
  const [userEmail, setUserEmail] = useState(null);

  /** hold reference to dateFromInput */
  const dateFromInput = useRef(null);

  /** hld reference to service ID */
  const serviceIdInput = useRef(null);

  /** hold reference to dateToInput */
  const dateToInput = useRef(null);

  const Store = StoreManager(AppStore, Stores, "ServiceManager");

  /**
   * A custom skeleton component for page loading screen
   */
  const CustomSkeleton = () => <div style={{ padding: 20 }}><Skeleton count={5} height={80} /></div>;


  /** 
   * hold the the current screen to disply at any point
   * default to loading skeleton 
   * */
  const [searchScreen, setSearchSreen] = useState(<CustomSkeleton />);

  /** 
   * hold a reference to the default screen loaded on page load 
   * If a search fials, we will go back to this screen and notify user of serach faulure
   * */
  const [defaultSearchScreen, setDefaultSearchScreen] = useState([]);

  /**
   * Load the default request once user email is available
   */
  Store.useStateAsync("email").then(email => {
    /** state userEmail only if not passed from the parent component */
    if (email && !userEmail) {
      email && setUserEmail(email)
    }
  })

  /**
    * Load default request on page load. We will use 
    */
  const loadDefaultRequest = (email = userEmail) => {

    /** * if all is fine, make the api call*/
    const apiPath = buildApiPath("searchWorkOrder");

    const callData = { email: email };

    makeApiCall(apiPath, callData).then(response => {

      console.log(response, "res data");

      if (response && response.data) {
        const responseData = response.data;
        const { error, message, data } = responseData;

        /** since we are loading data that might not be available user, we will be silent 
         * if there is an error, our concern is the data return for user with previous schedules
         */
        console.log(data, "data returned");

        if (!error) {
          if (data && data.length > 0) {
            /** pass the data through serializer that converts to schedular display format */
            const parsedSchedules = parseScheduleDataForScheduler(data);

            console.log(parsedSchedules, "parsed, schedules");

            /** create a new schedule screen with the returned information */
            if (parsedSchedules) {

              const defaultScreen = <ScheduleList scheduleData={parsedSchedules} />;

              /** save the default screen. We will show this screen if a search result fails  */
              setDefaultSearchScreen(defaultScreen);

              /** show this screen as the default schedule screen  */
              setSearchSreen(defaultScreen)
              return toast.success("existing schedules loaded");
            }
          }
        }
        /** 
         * by default, show the blank schedule calendar. This will happen if user has no
         * existing schedules available. 
         */
        setSearchSreen(<ScheduleList />)

      } else {
        toast.warn("Could not load previous schedules")
      }
    }).catch(e => {
      toast.error(e.message)
    })
  }

  /**
   * 
   * Search the service ID using either the service ID provided or the 
   * Date range available. 
   * 
   * @param {*} email 
   * @param {*} serviceId 
   * @param {*} dateFrom 
   * @param {*} dateTo 
   */
  const searchRequest = (email = userEmail, serviceId = null, dateFrom = null, dateTo = null) => {

    /** * if all is fine, make the api call*/
    const apiPathSearchByService = buildApiPath("searchWorkOrder");
    const apiPathSearchByDate = buildApiPath("searchWorkOrderByDate");

    /** use availabe date information or the one provided */
    serviceId = serviceId ?? serviceIdInput.current;
    dateFrom = dateFrom ?? dateFromInput.current;
    dateTo = dateTo ?? dateToInput.current;

    /** default call data. We will build on this based on the param passed */
    let callData = { email: email };

    /** 
     * validate date vales provided for search. both date range must be provided
     * if any of the date is provided,  if no date is provided, we will simply use only 
     * the serviceId for our search.
     */
    if (serviceId) {
      callData = { ...callData, service_id: serviceId };
    }

    /** if we are searching with date, we must use both date ranges */
    if ((dateFrom && !dateTo) || (dateTo && !dateFrom)) {
      return toast.error("When searching with date, you must select both date range")
    }

    /** at least search parameter must be provided */
    if (!dateFrom && !dateTo && !serviceId) return false;

    /** 
     * we will assume we are searching only by the ID
     * This willc hange base on the date range and value selection below
     */
    let apiPath = apiPathSearchByService;

    /** search with all parameters if all values are provided */
    if (dateFrom && dateTo) {
      /** we will search by all parameters including dates and serviceId */
      apiPath = apiPathSearchByDate;
      callData = { ...callData, date_from: dateFrom, date_to: dateTo }
    }

    console.log(callData, "total call data");

    /** show load sjeleton */
    setSearchSreen(<CustomSkeleton />);

    makeApiCall(apiPath, callData).then(response => {

      console.log(response, "res data");

      if (response && response.data) {
        const responseData = response.data;
        const { error, message, data } = responseData;

        /** since we are loading data that might not be available user, we will be silent 
         * if there is an error, our concern is the data return for user with previous schedules
         */
        console.log(data, "data returned from search");

        if (!error) {
          if (data && data.length > 0) {
            /** pass the data through serializer that converts to schedular display format */
            const parsedSchedules = parseScheduleDataForScheduler(data);

            console.log(parsedSchedules, "parsed, schedules");

            /** create a new schedule screen with the returned information */
            if (parsedSchedules) {
              setSearchSreen(<ScheduleList scheduleData={parsedSchedules} />)
              return toast.success("Searched schedules loaded");
            }
          } else {
            /** search result is empty. No data is returned */
            setSearchSreen(defaultSearchScreen);
            return toast.info(message);
          }
        } else {
          /** treat error information */
          toast.warn(message);
          /** reload the default schedule page */
          setSearchSreen(defaultSearchScreen);
        }
      } else {
        toast.warn("Could not search. Something went wrong");
        /** show the deault page  */
        setSearchSreen(defaultSearchScreen);
      }
    }).catch(e => {
      toast.error(e.message)
    })
  }

  /** set datefrom selected */
  const handleFromDateChange = (date) => {
    if (date) {
      dateFromInput.current = date ? date.format("YYYY-MM-DD") : null;
    }
  }
  /** set dateTo selected */
  const handleToDateChange = (date) => {
    if (date) {
      dateToInput.current = date ? date.format("YYYY-MM-DD") : null;
    }
  }
  /** set service selected */
  const handleServiceIdChange = (value) => {
    const regEx = /\D+/ig;

    if (regEx.test(value.target.value)) {
      return value.target.value = null;
    }
    serviceIdInput.current = value.target.value;
  }

  /**
   * Display the schedular 
   * @param {*} props 
   * @returns 
   */
  const ScheduleList = (props) => {

    const scheduleData = props.scheduleData ?? [];
    const startDayHour = props.startDayHour ?? 8;
    const endDayHour = props.endDayHour ?? 18;

    // console.log(scheduleData, "schedule data");

    return (
      <div style={{ padding: 20, paddingTop: 0 }}>
        <Paper>
          <Scheduler data={scheduleData} >
            {/**<WeekView startDayHour={startDayHour} endDayHour={endDayHour} /> */}
            {/** <DayView startDayHour={startDayHour} endDayHour={endDayHour} /> */}
            <MonthView startDayHour={startDayHour} endDayHour={endDayHour} intervalCount={30} />
            <Appointments onClick={(e) => alert(e)} />
          </Scheduler>
        </Paper>
      </div>
    )
  }

  /** once we can set userEmail value, load the default schedule view for this user */
  useEffect(() => {
    loadDefaultRequest(userEmail)
  }, [userEmail])

  return (
    <>
      <Paper
        style={{
          padding: 5,
          marginTop: 5,
          paddingLeft: 80,
          marginBottom: 20,
          broder: "none",
          width: "100%",
        }}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <FormControl>
              <CustomInput
                id="regular"
                inputProps={{
                  onChange: handleServiceIdChange,
                  placeholder: "Type the service ID"
                }}
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3} style={{ marginTop: 25 }}>
            <FormControl>
              <Datetime timeFormat={false} inputProps={{ placeholder: "From Date" }}
                closeOnSelect={true} dateFormat="YYYY-MM-DD"
                onChange={handleFromDateChange} />
            </FormControl>
          </GridItem>

          <GridItem xs={12} sm={12} md={4} lg={3} style={{ marginTop: 25 }}>
            <FormControl>
              <Datetime timeFormat={false} inputProps={{ placeholder: "To Date" }}
                closeOnSelect={true} dateFormat="YYYY-MM-DD"
                onChange={handleToDateChange} />

            </FormControl>
          </GridItem>

          <GridItem xs={12} sm={12} md={4} lg={3} style={{ marginTop: 25 }}>
            <CustomFormButton primary round
              onClick={searchRequest}
            >
              Search
            </CustomFormButton>
          </GridItem>

        </GridContainer>
      </Paper>
      {searchScreen}
    </>
  );
}
