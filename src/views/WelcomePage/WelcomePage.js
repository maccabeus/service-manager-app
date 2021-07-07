import React, { useState, useEffect, useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Event from "@material-ui/icons/Event";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/service-manager/welcomePage.js";

/** 
 * bring in Store management. We will read and write to it once page loads
 */
import { StoreManager } from "react-persistent-store-manager";
import { Stores, AppStore } from "./../../state/store";
import { useHistory } from "react-router-dom";

/**
 * create 
 */
const useStyles = makeStyles(styles);

export default function WelcomePage() {

  /**
   * create a store manager to so that we can read and write to store.
   * This store module is a persistent store, which mean data are available
   * whenever user visit the app again
   */
  const Store = StoreManager(AppStore, Stores, "ServiceManager");

  /** history object for our page navigation */
  const history= useHistory();

  // /**
  //  * Get the user email earlier saved in the store. If there is an existing email
  //  * we will prompt user to confirm, but if not, we will ask them to add afresh
  //  */
  //  const [userEmail, setUserEmail] = useState(null);

   /** refernce to the user email  user provide*/
   const emailInput= useRef(null)
  
  /**
   * 
   * Screen shown if user have not provided their email any before.
   * When user revisit, we will only show then 
   * 
   * @param {bool}    firstTime
   * @param {string}  email
   * @returns 
   */
   const WelcomeScreen = ( props ) => {
    const { firstTime , email }= props;

    const emailMessage= !firstTime ? 
    `Is this still your email ${email}. Click proceed to continue` :
    `Just this time, we won't ask you again`

    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h2>Welcome</h2>
                      <div className={classes.socialLine}>
                        <Event size={"lg"} />
                      </div>
                    </CardHeader>
                    <p className={classes.divider}>{emailMessage}</p> 
                    <CardBody>
                      <CustomInput
                        labelText="Enter emal address..."
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "email",
                          defaultValue:userEmail,
                          onChange: (e) => updateEmail(e.target.value),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg" onClick={saveUserEmail}>
                        PROCEED
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    
    )
  }

  /**
   *  Update user email
   * @param {*} email 
   */
  const saveUserEmail=()=>{
    
    console.log(emailInput, "Email input");

    const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!emailInput.current  || !regExp.test(emailInput.current)) {
      return alert("Please provide valid email")
    }
    Store.update("email", emailInput.current);

    history.push("/schedule")
  }

  /**
   * Update user 
   */
  const updateEmail=(value)=>{
    emailInput.current=value
  }

  /**
   * variable tracks the current screen in view. Default screen to blank while we check the user email
   * This will be for a very short while before we retrieve our Store information
   * 
   * @todo: in the future, we could show loading skeleton
   */
  const [currentScreen] = useState(<WelcomeScreen firstTime={true}  email={null} />)

  
  Store.useStateAsync("email").then(email => {

    if (email) {
      /** User has been here before. We will only ask them to comfirm their email address
       * take user directly to the scheduling page
       *  */
        history.push("/schedule")
        //tCurrentScreen(<WelcomeScreen firstTime={false}  email={email} />)
    }
    })
  const classes = useStyles();

  /**
   * once we have a new currentScreen view, refresh 
   */

  useEffect(()=>{
    // animateCard();
  }, [userEmail])

  /** this will vary depending on the user inforation retrieved from the store */
  return ( <>{ currentScreen } </>);
}