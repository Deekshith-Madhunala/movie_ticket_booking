import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Button, Card, TextField, Typography } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import genericService from '../../rest/GenericService';


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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [dob, setDob] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const handleRegister = async (event) => {
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

    // Construct newUser without ID
    const newUser = {
      firstName,
      lastName,      
      zipCode,
      city,
      email,
      password,
      role: 'USER',
      phoneNumber,
      dateOfBirth: dob
    };

    try {
      // Call createUser to get the new user ID
      const userdata = await genericService.createUser(newUser); // Wait for the promise to resolve
      console.log('userdata', userdata); // Logs the integer ID like 10028
      // const userDetails = await genericService.getUserById(userdata);
      // console.log('userDetails', userDetails);


      // Add the ID to the newUser object

      // Call the register function with the updated user object
      register(userdata);

      // Navigate to the desired page after successful registration
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again.');
    }
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
            label="First Name"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Last Name"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
            label="Date of Birth"
            fullWidth
            margin="normal"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="City"
            fullWidth
            margin="normal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="ZipCode"
            fullWidth
            margin="normal"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Contact"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
