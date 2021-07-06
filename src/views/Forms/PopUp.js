import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/service-manager/customStyles";

export function PopUp (props) {

  const useStyles = makeStyles(styles);
  const classes= useStyles();

  const {children}= props;
  const position= props.position ?? "right center";

  return (
  <Popup position={position} {...props}>
    {children}
    <CircularProgress />
  </Popup>

  )
} 