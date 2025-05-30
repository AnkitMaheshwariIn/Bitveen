import React, { useEffect } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

export const MenuProvider = ({
  options = {
    eventCurrentTarget: undefined,
    isOpen: false,
    menuItems: [{
      label: '',
      handleItemClose: () => {}  
    }],
    handleClose: () => {},
  }
}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Runs every render
    const handleClick = (eventCurrentTarget) => {
      setAnchorEl(eventCurrentTarget);
    };
    // set current button clicked event so that menu will display near that.
    if (options.eventCurrentTarget && !anchorEl) {
      handleClick(options.eventCurrentTarget)
    }
  });

  const handleCloseFunc = () => {
    options.handleClose();
    setAnchorEl(null);
  };

  return (
    <>
      {/*
          if the isOpen is false the dialog will be closed. 
          close() function sets the isOpen to false,
      */}
      {options.isOpen && (
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseFunc}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          options.menuItems.map((x, index) => {
            return (
              <MenuItem key={index} onClick={x.handleItemClose}>
                {x.icon && 
                  <ListItemIcon style={{minWidth: '30px'}}>
                    {x.icon()}
                </ListItemIcon>
                }
                <Typography color={`${x.color}`}>
                  {x.label}
                </Typography>
              </MenuItem>
            )
          })
        }
      </Menu>
      )}
    </>
  );
};
