import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

export const ConfirmDialog = ({
  options = {
    isOpen: false,
    message: '',
    message2: undefined,
    handleClose: () => {},
    handleSubmit: () => {}
  }
}) => {
  return (
    <>
      {/*
          if the isOpen is false the dialog will be closed. 
          close() function sets the isOpen to false,
      */}
      {options.isOpen && (
        <Dialog open={options.isOpen} maxWidth="sm"> 
          <DialogTitle>Confirm the action</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {options.message}
            </DialogContentText>
            {options.message2 &&
              <DialogContentText>
                {options.message2}
              </DialogContentText>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={options.handleClose}>
              Cancel
            </Button>
            <Button autoFocus color="error" onClick={() => {
              options.handleClose();
              options.handleSubmit();
            }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
