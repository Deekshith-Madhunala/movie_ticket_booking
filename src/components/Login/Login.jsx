import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Card, TextField, Typography } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import genericService from '../../rest/GenericService';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://media.istockphoto.com/id/1480674106/photo/3d-rendering-of-fingerprint-padlock-on-blue-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Fw8krT4yrlhmdIuEgda4FnCQQuqt8dzXDrHit-mhU9k=)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await genericService.login(email, password);
      const { role } = response; // Assuming role is part of the response
      login(response); 

      // Redirect based on role
      if (role === 'ADMIN' || role === 'MANAGER') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <BackgroundBox>
      <Card sx={{ padding: 4, maxWidth: 500 }}>
        <form onSubmit={handleLogin}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            variant="outlined"
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="text" color="primary">
              Forgot Password?
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="text" 
              onClick={() => navigate('/register')}
            >
              Don't have an account? Sign up
            </Button>
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
