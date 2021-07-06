import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader";
import CustomSelect from "./CustomSelect";
import Email from "@material-ui/icons/Email";
import CustomInput from "components/CustomInput/CustomInput.js";
import { CustomFormButton } from "./CustomFormButton";

import styles from "assets/jss/service-manager/welcomePage.js";

const useStyles = makeStyles(styles);

export default function CreateServiceForm(props) {

  const {
    email, service, serviceList, onCreateServiceRequestClick, onUserEmailUpdate, onSelectServiceRequestClick
  } = props;
  
  const classes = useStyles();

  const cleanEmailField=(e)=>{
    const value= e.target.value;
    if(value &&  value.indexOf("@")===-1) e.target.value=null;
  }

  /** 
   * set the userEmail refernec pointer once page loads. This is the default email provided 
   * from the main schedule page 
   */
   onUserEmailUpdate(email)

  return (
    <div
      className={classes.container}
      style={{ backgroundColor: "white", padding:10, paddingTop:80, paddingBottom:60}}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary" className={classes.cardHeader}>
              <h4>Request Service</h4>
            </CardHeader>
            <form className={classes.form}>

              <CardBody>
                {/* <Input  defaultValue={email} className={classes.formInput} 
                aria-controls="email" aria-haspopup="true"  onChange={(e)=>{
                  onUserEmailUpdate(e.target.value)
                }}
                onClick={cleanEmailField}
                /> */}

              <CustomInput
                      id="material"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end" >
                            <Email />
                          </InputAdornment>
                        ),
                        value: email,
                        onclick:{cleanEmailField},
                        onchange: (e)=>onUserEmailUpdate(e.target.value)
                      }}
                    />
                
                <CustomSelect className={classes.formInput}  
                serviceList={serviceList} 
                service={service}
                onSelectServiceRequestClick={onSelectServiceRequestClick}
                />
              </CardBody>

              <CardFooter className={classes.cardFooter}>

                <CustomFormButton title="Submit Request" showSpinner={true}
                onClick={()=>onCreateServiceRequestClick ? onCreateServiceRequestClick() : null} />
                
              </CardFooter>

            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
