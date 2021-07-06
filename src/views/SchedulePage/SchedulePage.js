import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useHistory } from "react-router-dom";

import UserIcon from "@material-ui/icons/VerifiedUser";
import Header from "components/Header/Header.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/service-manager/navbarsStyle";

/** use a dummy profile image */
import profileImage from "assets/img/faces/avatar.jpg";

/** * import all the required components for our page view*/
import ScheduleNavigation from "./ScheduleNavigation";

/** store management libs and definitions */
import { StoreManager } from "react-persistent-store-manager";
import { Stores, AppStore } from "./../../state/store";

/** import utility functions */
import { makeApiCall, buildApiPath , isValidateEmail} from "library/AppUtilities";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function SchedulePage() {

  /** create material UI styles */
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * Handles user idetifcation email. There will be an option to changes this before user make new request
   */
  const [userEmail, setUserEmail] = useState("");

  /** 
   * keep tracks of the service selected. This will be useful when 
   * implementing click event on the calendar view
   */
  const [service, setService] = useState("Please select  service");

  /** force a page refresh each time value changes */
  const [refresh, setRefresh] = useState([]);

  /** create an instance of service manager store instance.
   * @note: the store we utilize is a persistent store which mean user details are 
   * retained and made available when they visit site again
   */
  const Store = StoreManager(AppStore, Stores, "ServiceManager");

  /**
   * If there is no email, take user back to the welcome page to provide email
   */
     Store.useStateAsync("email").then(email => {
      email ? setUserEmail(email) : history.push("/")
    })

  /** store the service list. contains only the names */
  const [serviceList, setServiceList] = useState([]);

  /**
   * if user has not provided an email we will take the user back to the welcome page
   */
  const history = useHistory();

  /** 
   * create reference to the service request form fields
   */

  const emailInput= useRef(userEmail);
  /** the selected service value */
  const serviceInput= useRef({id: null,  name: null, duration: null})

  /**
   * Load the list of available services
   */
  const loadServices= async ()=>{

    const apiPath= buildApiPath("service");
    let response= null;
    
    try {
      response= await makeApiCall(apiPath);
    } catch (e) {
      toast.error(`${e.message}. Please try again or refresh`)
    }
   
    if(!response) {
      toast.info("could not load services. Please try again")
    }
    if(response && response.data) {
      const data= response.data.data;

    /** 
       * hold all the avialble services. We will pass over to 
       * a service list to pass over to schedule creation form and a variable 
       * to hold the list of available services. 
    * */
      const serviceList= data.map(service=>{
        return service;
      })
    /** Add serves data to state variables */
    setServiceList(serviceList);
    }
  }

  const refreshPage=()=>{
    /** concat new value to force a page refresh */
    setRefresh(refresh.concat(true))
  }

  /**
   * Create a valid service request
   */
  const createServiceRequest=()=>{
    
    if(!serviceInput.current || !emailInput.current) {
     return toast.error("Service and email must be provided")
    }
    const {id, duration} = serviceInput.current;
    const email= emailInput.current;

    if(!isValidateEmail(email)) {
     return toast.error("invalid email provided. Please try again")
    }

     if(!id || !duration) {
      return toast.error("Cannot find service details. Please ensure you have selected a valid service")
     }

     /**
      * if all is fine, make the api call
      */
     const apiPath= buildApiPath("addWorkOrder");

     const callData={email: email, service_id:id};
    
     makeApiCall(apiPath, callData, "post").then(response=>{
       if(response && response.data) {
        const responseData= response.data;
        console.log(responseData, "res data");
        const {error, message, data}= responseData;
        if(error) return toast.info(message);
        toast.success(message);
        refreshPage();
        window.location.reload();
       } else {
         toast.warn("Could not retrieve any information. Please try again")
       }
     }).catch(e=>{
       toast.error(e.message)
     })
  }

  const selectServiceRequest=(selectedService)=>{
    console.log(selectedService, "seleted");
    const {id, name, duration}= selectedService;
    /** update the service state for display */
    setService(name)
    /** update service reference */
    serviceInput.current= {id, name, duration}
    refreshPage()
  }

  const updateUserEmail=(email)=>{
    /** update reference  */
    emailInput.current=email
  }

  /**
   * load service list and all the necessasry informations on page load
   */
  useEffect(()=>{
    loadServices()
  }, [])

  /**
   * reload page when tracked state values changes
   */
  useEffect(() => {
    console.log(userEmail, "user email")
  }, [userEmail, refresh, serviceList, service])

  return (
    <div className={classes.section}>

      <ToastContainer hideProgressBar />
      
      <div id="navbar" className={classes.navbar}>
        <Header
          brand={<h3>Service Manager</h3>}
          color="primary" 
          rightLinks={
            <List className={classes.list}>
              {/* <ListItem className={classes.listItem}>
                <Button
                  href="#"
                  className={classes.navLink + " " + classes.navLinkActive}
                  onClick={openScheduler}
                  color="transparent">
                  <EventNote className={classes.icons}

                  /> Request Servic
                </Button>
              </ListItem> */}

              <ListItem className={classes.listItem}>
                <Button
                  href="#"
                  className={"primary"}
                  onClick={(e) => e.preventDefault()}
                  color="transparent">
                  <UserIcon className={classes.icons} /> {userEmail}
                </Button>
              </ListItem>

              <ListItem className={classes.listItem}>
                <img src={profileImage} className={classes.img} alt="profile" />
              </ListItem>
            </List>
          }
        />
      </div>
      <ScheduleNavigation 
        email={userEmail}
        service={service}
        serviceList={serviceList}  
        onCreateServiceRequestClick={createServiceRequest} 
        onSelectServiceRequestClick={selectServiceRequest}
        onUserEmailUpdate={updateUserEmail}
        />
    </div>
  );
}