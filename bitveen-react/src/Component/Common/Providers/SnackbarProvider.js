import React from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarProvider = ({
  options = {
    isOpen: false,
    message: '',
    severity: '',
    vertical: undefined,
    horizontal: undefined,
    duration: undefined,
    action: undefined,
    handleClose: () => {}
  }
}) => {
  return (
    <>
      {/*
          if the isOpen is false the dialog will be closed. 
          close() function sets the isOpen to false,
      */}
      {options.isOpen && (
        <Snackbar
            open={options.isOpen}
            anchorOrigin={{ vertical: (options.vertical || 'bottom'), horizontal: (options.horizontal || 'left') }}
            autoHideDuration={options.duration || 6000} 
            onClose={options.handleClose}
            key={{ vertical: (options.vertical || 'bottom'), horizontal: (options.horizontal || 'left') }}
        >
            <Alert severity={options.severity} sx={{ width: '100%' }} action={options.action}>
                {options.message}
            </Alert>
        </Snackbar>
      )}
    </>
  );
};
