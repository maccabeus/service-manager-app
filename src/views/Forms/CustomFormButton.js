import React from 'react';
import Button from "components/CustomButtons/Button.js";
// import { CircularProgress } from '@material-ui/core';

export function CustomFormButton (props) {

  let buttonColor= "transparent";
  let simple= true;

  if(props.primary===true) {
    simple=false;
    buttonColor="primary"
  }
  const buttonSize= props.size ?? "lg";
  const onClick= props.onClick ?? null;
  // const showSpinner= props.showSpinner ?? false;
  const enabled = props.enabled ?? true;
  const title = props.title ?? "Submit Request"
  const round = props.round && props.round===true;


  return (

    <Button  color={buttonColor} size={buttonSize} enabled={enabled} round={round}
      onClick={()=> onClick ? onClick() : null}>
        {/* {showSpinner && <CircularProgress classes={{backgroundColor:"green"}} />} */}
        {props.children ?? title}
    </Button>
  )
} 