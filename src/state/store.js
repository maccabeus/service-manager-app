import {Store} from "react-persistent-store-manager"

/**
 * An abject containing all the stores in our application
 */
export const Stores = {

    /** The service manager global store store */
    ServiceManager:{   
        email:null,
        /** default list of services to empty */
        services:[]
    },
};

/**
 * return all the store our application will use
 */
export const AppStore= Store(Stores);

