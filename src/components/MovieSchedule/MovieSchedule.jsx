import React, { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, TextField, MenuItem, Card, CardMedia, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

const Item = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(0.5),
}));
const CardItem = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  padding: theme.spacing(0.5),
}));

const MovieSchedule = () => {
  const location = useLocation();
  const { movie } = location.state || {}; // Retrieve movie data passed from MovieCard 
  const navigate = useNavigate(); // Initialize navigate

  // State for selected date, theater, and time
  const [selectedDate, setSelectedDate] = useState('16 Dec');
  const [selectedTheater, setSelectedTheater] = useState('Grand Indonesia');
  const [selectedTime, setSelectedTime] = useState('');

  const handleBookTicket = () => {
    if (!selectedTime) {
      alert('Please select a showtime.');
      return;
    }
    // Pass movie data along with selected date, theater, and time
    navigate('/seat-selection', {
      state: {
        movie,
        selectedDate,
        selectedTheater,
        selectedTime,
      },
    });
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', p: 2 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6">JADWAL</Typography>
        </Toolbar>
      </AppBar>

      {/* Date and Location Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body1">Pilih jadwal bioskop yang akan kamu tonton</Typography>
        </Box>
        <Box>
          <TextField
            select
            label="Tanggal"
            value={selectedDate} // Capture selected date
            onChange={(e) => setSelectedDate(e.target.value)} // Update state on change
            sx={{ mr: 1 }}
          >
            {['15 Dec', '16 Dec', '17 Dec', '18 Dec', '19 Dec'].map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Theater"
            value={selectedTheater} // Capture selected theater
            onChange={(e) => setSelectedTheater(e.target.value)} // Update state on change
            sx={{ mr: 1 }}
          >
            {['Grand Indonesia', 'Mangga Dua Square', 'Plaza Indonesia'].map((cinema) => (
              <MenuItem key={cinema} value={cinema}>
                {cinema}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {/* Schedule Grid */}
      <Grid container spacing={2} columns={16}>
        {/* Movie Listings */}
        <Grid item xs={12} md={8}>
          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedTheater} CGV
            </Typography>
            <Typography variant="body2" gutterBottom>
              J.L. MH. TAHMIRIN NO.1
            </Typography>

            {/* Regular 2D */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">REGULAR 2D</Typography>
              <Typography variant="body2">Rp. 45.000 - 50.000</Typography>
              {['11:00', '13:45', '14:40', '15:40', '17:15', '18:15', '20:00', '21:00'].map((time) => (
                <Button
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  key={time}
                  onClick={() => setSelectedTime(time)} // Capture selected time
                  sx={{ mr: 1, mb: 1 }}
                >
                  {time}
                </Button>
              ))}
            </Box>

            {/* Gold Class 2D */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">GOLD CLASS 2D</Typography>
              <Typography variant="body2">Rp. 100.000</Typography>
              {['12:40', '15:40', '18:35', '17:10'].map((time) => (
                <Button
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  key={time}
                  onClick={() => setSelectedTime(time)} // Capture selected time
                  sx={{ mr: 1, mb: 1 }}
                >
                  {time}
                </Button>
              ))}
            </Box>

            {/* Velvet 2D */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">VELVET 2D</Typography>
              <Typography variant="body2">Rp. 100.000</Typography>
              {['12:15', '13:45', '14:50'].map((time) => (
                <Button
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  key={time}
                  onClick={() => setSelectedTime(time)} // Capture selected time
                  sx={{ mr: 1, mb: 1 }}
                >
                  {time}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Movie Details */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 2 }}>
            {movie?.poster && (
              <Card elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <CardMedia
                  component="img"
                  image={movie.poster}
                  height="300"
                  borderRadius="10px"
                  alt={movie.title}
                  style={{ borderRadius: '8px', marginBottom: '25px' }}
                />
                <CardContent style={{ padding: '0px' }}>
                  <Typography variant="h4" gutterBottom textAlign="justify">
                    {(movie?.title || 'Movie Title').toUpperCase()}
                  </Typography>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="start">
                    <Item>Genre :</Item>
                    <Item>{movie.genre}</Item>
                  </Stack>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="start">
                    <Item>Duration :</Item>
                    <Item>{movie.duration} minutes</Item>
                  </Stack>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="start">
                    <Item>Rating :</Item>
                    <Item>{movie.rating}</Item>
                  </Stack>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="start">
                    <Item>Release :</Item>
                    <Item>{movie.releaseDate}</Item>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>

          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
            {movie?.poster && (
              <Card elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom textAlign="justify">
                    {movie?.title?.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Daftar Jadwal Tersedia
                  </Typography>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="space-between">
                    <CardItem>Regular 2D</CardItem>
                    <CardItem>{selectedTime}</CardItem>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBookTicket}
                    disabled={!selectedTime} // Disable if no time is selected
                  >
                    Book Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieSchedule;
