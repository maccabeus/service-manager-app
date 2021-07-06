import axios from "axios";
import { BASE_API_URL } from "../env";

/**
 * These are the available API endpoints that we can call
 */
export const apiEndPoints = {
    service: "service",
    addWorkOrder: "workorder",
    searchWorkOrder: "workorder/search",
    searchWorkOrderByDate: "workorder/search/date",
}

/** list of allowed API method verbs */
const allowedApiMethods = ["post", "get", "delete"];

/**
 * Use to build a full path api path for our call based on the callType provided
 */
export const buildApiPath = (callType) => {

    if (Object.keys(apiEndPoints).indexOf(callType) === -1) {
        alert(`This call type is not available. You can either use ${Object.keys(apiEndPoints).join(", or ")}`)
        return null
    }

    /** 
     * split our endpoint arrays into key value pair
     * return the api endPoint defined for this callType 
    */
    for (const [key, value] of Object.entries(apiEndPoints)) {
        if (key === callType) {
            return `${BASE_API_URL}/${value}`;
        }
    }
    /** default return to null */
    return null;
}

/**
 * Use this to make dynamic api calls
 * @param apiPoint 
 * @param callData 
 * @param method 
 */
export const makeApiCall = (apiPoint, callData , method = "get") => new Promise((resolve, reject) => {

    /** Check if this is a valid call allowed */
    if (allowedApiMethods.indexOf(method) === -1) {
        const msg = "The method is not a valid axios API call method";
        alert(msg);
        return console.error(msg)
    }

    /** create a wrapper around axios calls. default to `get`  */
    const axiosCall = method.toLowerCase() === "post" ? axios.post : axios.get;

    /**
     * create the call data object based on the method we are calling. if this is a `get` method
     * we will append callData provided to a param key, else we will pass it directly
     */
    const axiosCallData = method.toLowerCase() === "get" ? ({ params: { ...callData } }) : callData;

    /** 
     * make the call. Note that this call could be any of the accepted call methods
     * for now, we only accept `get` and `post`, and `delete` calls 
     * */
    axiosCall(apiPoint, axiosCallData).then(response => {
        resolve(response);
    }).catch(e => {
        reject(e)
    })
});

/**
 * Validate email
 * @param {*} email 
 * @returns 
 */
export const isValidateEmail=(email)=>{
    const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email)
}

export const minutesToHourScreenFormat=(minutesValue, dayLabel="day", hourLabel="hour", minutesLabel="minute" )=>{

    /** to convert minutes to hour value, we must divide all through by 60 */
    const hourDivisor=60;

    /** 60 minutes * 24 Hours */
    const dayDivisor= 1440;
    
    let day=0;
    let hour=0;

    if(!minutesValue) return null;

    if(minutesValue <= 60) return `${minutesValue} ${minutesLabel}`;

    minutesValue= parseInt(minutesValue);

    /** get days value */
    if(minutesValue >= dayDivisor) {
        while (minutesValue >= dayDivisor) {
            minutesValue = minutesValue - dayDivisor
            day=day+1
        }
    }

    /** get the hourly values */
    if(minutesValue >= hourDivisor) {
        while (minutesValue >= hourDivisor) {
            minutesValue = minutesValue - hourDivisor
            hour=hour+1
        } 
    }
    
    const daySuffix = day > 1 ? `s` : ``;
    const hourSuffix = hour > 1 ? `s` : ``;
    const minutesSuffix = minutesValue > 1 ? `s` : ``;

    let returnValue="";

    if(day > 0) {
        returnValue= `${day} ${dayLabel}${daySuffix}`
    }
    if(hour > 0) {
        returnValue= `${returnValue} ${hour} ${hourLabel}${hourSuffix}`
    }
    if(minutesValue > 0) {
        returnValue= `${returnValue} ${minutesValue} ${minutesLabel}${minutesSuffix}`
    }
    return returnValue;
}

/**
 * parsed date time string to object of date vales
 * @param {*} dateStr 
 * @param {*} timeStr 
 * @param {*} delim 
 * @param {*} timeDelim 
 * @returns 
 */
export  const parseDateTimeString=(dateStr, timeStr=null, delim="-", timeDelim=":")=>{
    
    if(! dateStr) return null;

    const dateArr= dateStr.split(delim);
    
    /** 
     * date provided in year-month-day format 
     * @Note: for the month to be valid we must subtract 1 from the value returned
     * javascript month starts from `0`. for example january is `0` in js and not `1`
     */
    if(!Array.isArray(dateArr) || dateArr.length < 3 ) return null;
    
    let parsedDateTime={
        year: parseInt(dateArr[0]),
        month: parseInt(dateArr[1]-1),
        day: parseInt(dateArr[2]),
    };
    /** if timeStr not provided, default time values to zero */
    let timeData={hour:0, minute:0, second:0}

    /** parse time sling in a similar fashion to date */
    if(timeStr!==null) {
        const timeArr= timeStr.split(timeDelim);
        if(Array.isArray(timeArr)) {
            timeData={
                hour: parseInt(timeArr[0]) ?? 0, 
                minute: parseInt(timeArr[1]) ?? 0, 
                second: parseInt(timeArr[2]) ?? 0 
            }
        }
    } 
     return ({...parsedDateTime,...timeData})   
}

/**
 * Parse response data as scheduler format
 * @param {*} responseData 
 * @returns 
 */
export const parseScheduleDataForScheduler=(responseData)=>{

    /** if no response data, return am empty array . This will display a blank scheduler*/
    if(!responseData) return [];

    const parsedData= responseData.map((schedule, k)=>{

        const {date_created, start_time, end_time, end_date, service_id, duration, description } = schedule;
        
        /** convert date and time strings to datetome objects for javascript date creation */
        const dateStart=parseDateTimeString(date_created, start_time);
        const dateEnd=parseDateTimeString(end_date, end_time);
        // const dateEnd=parseDateTimeString(date_created, end_time);

        const curScheduleData={
            title: description,
            startDate: new Date(dateStart.year, dateStart.month, dateStart.day,dateStart.hour,dateStart.minute),
            endDate: new Date(dateEnd.year, dateEnd.month, dateEnd.day,dateEnd.hour,dateEnd.minute),
            id: service_id,
            location: description,
        }
        return curScheduleData
    })
    return parsedData;
}
