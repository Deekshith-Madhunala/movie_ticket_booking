import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Card, TextField, Typography } from '@mui/material';

// Styled Paper component for the left side (if needed)
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Background style
const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://media.istockphoto.com/id/1480674106/photo/3d-rendering-of-fingerprint-padlock-on-blue-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Fw8krT4yrlhmdIuEgda4FnCQQuqt8dzXDrHit-mhU9k=)', // Add your background image here
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh', // Full height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

// Login component
function Login() {
  return (
    <BackgroundBox>
      <Card sx={{ padding: 4, maxWidth: 500 }}>
        <form>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <TextField
            variant="outlined"
            label="Email"
            fullWidth
            margin="normal"
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              color="primary"
            >
              Forgot Password?
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='text'>Don't have an account? Sign up</Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>

        </form>
      </Card>
    </BackgroundBox>
  );
}

export default Login;
