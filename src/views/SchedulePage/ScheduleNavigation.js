import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.js";

/**
 * import the necessary sub components for this componets
 */
import RequestSearch from "./RequestSearch";
import CreateServiceForm from "views/Forms/CreateServiceForm";

const useStyles = makeStyles(styles);

export default function ScheduleNavigation(props) {

  const {
    email, service, serviceList, onCreateServiceRequestClick, 
    onSelectServiceRequestClick, onUserEmailUpdate} = props;

  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <div id="navigation-pills" style={{ backgroundColor: "whitesmoke", height:"100%" }}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <NavPills
                color="primary"
                tabs={[
                  {
                    tabButton: "Search Request",
                    tabIcon: Dashboard,
                    tabContent: <RequestSearch email={email} />,
                  },
                  {
                    tabButton: "Request Service",
                    tabIcon: Schedule,
                    tabContent: 
                    <CreateServiceForm 
                    serviceList={serviceList} 
                    email ={email}
                    service= {service}
                    onCreateServiceRequestClick={onCreateServiceRequestClick}
                    onSelectServiceRequestClick={onSelectServiceRequestClick}
                    onUserEmailUpdate={onUserEmailUpdate}
                    />
                  }
                ]}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
