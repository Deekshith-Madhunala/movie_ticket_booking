// MovieSchedule.jsx
import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';

const MovieSchedule = () => {
  const location = useLocation();
  const { movie } = location.state || {}; // Retrieve movie data passed from MovieCard 

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
            defaultValue="16 Dec"
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
            label="Jakarta"
            defaultValue="Grand Indonesia"
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
        <Grid item xs={12} md={8} size={11}>
          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              GRAND INDONESIA CGV
            </Typography>
            <Typography variant="body2" gutterBottom>
              J.L. MH. TAHMIRIN NO.1
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">REGULAR 2D</Typography>
              <Typography variant="body2">Rp. 45.000 - 50.000</Typography>
              {['11:00', '13:45', '14:40', '15:40', '17:15', '18:15', '20:00', '21:00'].map((time) => (
                <Button variant="outlined" key={time} sx={{ mr: 1, mb: 1 }}>
                  {time}
                </Button>
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">GOLD CLASS 2D</Typography>
              <Typography variant="body2">Rp. 100.000</Typography>
              {['12:40', '15:40', '18:35', '17:10'].map((time) => (
                <Button variant="outlined" key={time} sx={{ mr: 1, mb: 1 }}>
                  {time}
                </Button>
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">VELVET 2D</Typography>
              <Typography variant="body2">Rp. 100.000</Typography>
              {['12:15', '13:45', '14:50'].map((time) => (
                <Button variant="outlined" key={time} sx={{ mr: 1, mb: 1 }}>
                  {time}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Movie Details */}
        <Grid item xs={12} md={4} size={5}>
          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              {movie?.title || "Movie Title"} {/* Display movie title dynamically */}
            </Typography>
            {movie?.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: 'auto', height: 'auto', borderRadius: '8px', marginBottom: '16px' }}
              />
            )}
            <Typography variant="body1">{movie.genre}</Typography>
            <Typography variant="body1">Duration: {movie.duration} minutes</Typography>
            <Typography variant="body1">Sutradara: Jon Watts</Typography>
            <Typography variant="body1">Rating Usia: SU</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              GRAND INDONESIA CGV
            </Typography>
            <Typography variant="body2">REGULAR 2D</Typography>
            <Typography variant="h6">14:40</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              BELI SEKARANG
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieSchedule;
