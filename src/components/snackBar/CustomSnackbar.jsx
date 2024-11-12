import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

let showSnackbarFn; // Function to trigger the Snackbar

const CustomSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  useEffect(() => {
    // Set the showSnackbar function to be used externally
    showSnackbarFn = (msg, severity = 'success', duration = 3000) => {
      setMessage(msg);
      setType(severity);
      setOpen(true);

      // Auto-close after specified duration
      setTimeout(() => {
        setOpen(false);
      }, duration);
    };
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// Function to call for showing the snackbar
export const showSnackbar = (msg, severity, duration) => {
  if (showSnackbarFn) showSnackbarFn(msg, severity, duration);
};

export default CustomSnackbar;
