import React, {useState, useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { InputAdornment} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Time from '@material-ui/icons/Timer';
import CustomInput from "components/CustomInput/CustomInput.js";
import { minutesToHourScreenFormat } from 'library/AppUtilities';

export default function CustomSelect(props) {

  const {serviceList, service, onSelectServiceRequestClick}= props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [selectedService, setSelectedService]= useState(service);
  const [selectedDuration, setSelectedDuration]= useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ServiceOptions=()=>{
    const options= serviceList?.map(service=>{
      return <MenuItem key={service.id} 
      onClick= {()=>{
        if(onSelectServiceRequestClick )  {
          setSelectedService(service.name);
          setSelectedDuration(service.duration);
          onSelectServiceRequestClick(service);
        }
      }}>
        {service.name}
        </MenuItem>
    })
    return options ?? null
  }

  useEffect(() => {
  }, [selectedService])

  return (
    <div>
      <div 
      style={{width: "100%", marginTop:50,paddingBottom:10, display:"flex"}}> 
      <Time  /> {minutesToHourScreenFormat(selectedDuration)}
      </div>

      <CustomInput
        id="material"
        formControlProps={{
          fullWidth: true
        }}
        inputProps={{
          endAdornment: (
            <InputAdornment position="end" onClick={handleClick} >
              <MenuIcon />
            </InputAdornment>
          ),
          value: selectedService,
          onclick:{handleClick}
        }}
      />
      <Menu
        style={{position:"fixed", left:"0"}}
        id="service-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose} >
          <ServiceOptions/>
      </Menu>
    </div>
  );
}