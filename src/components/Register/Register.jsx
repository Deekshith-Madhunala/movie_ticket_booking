import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Card, TextField, Typography } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://media.istockphoto.com/id/1480674106/photo/3d-rendering-of-fingerprint-padlock-on-blue-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Fw8krT4yrlhmdIuEgda4FnCQQuqt8dzXDrHit-mhU9k=)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

function Register() {
  const { register } = useAuth(); // Assume you have a register function in AuthContext
  const navigate = useNavigate();

  // State to store input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setError('');

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const name = email.substring(0, email.indexOf('@'));
    // Call register function from Auth context
    const newUser = { email, password, name };
    register(newUser);
    navigate('/'); // Redirect to home page or login page after registration
  };

  return (
    <BackgroundBox>
      <Card sx={{ padding: 4, maxWidth: 500 }}>
        <form onSubmit={handleRegister}>
          <Typography variant="h4" gutterBottom>
            Register
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
          <TextField
            variant="outlined"
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
        </form>
      </Card>
    </BackgroundBox>
  );
}

export default Register;
