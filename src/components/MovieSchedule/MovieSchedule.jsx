import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import genericService from '../../rest/GenericService';

const Item = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(0.5),
}));

const MovieSchedule = () => {
  const location = useLocation();
  const { movie } = location.state || {};
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState({ type: '', time: '' });
  const [theaters, setTheaters] = useState([]);

  // Generate dates for the next week
  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toLocaleDateString(); // Format the date as needed
    });
  };

  const handleBookTicket = () => {
    // Debugging logs to check selected values
    console.log("Selected Time:", selectedSeat.time);
    console.log("Selected Seat Type:", selectedSeat.type);
    console.log("Selected Theater:", selectedTheater);
    console.log("Selected Theater Id:", selectedTheaterId);

    if (!selectedSeat.time || !selectedSeat.type) {
      alert('Please select a showtime and seat type.');
      return;
    }
    navigate('/seat-selection', {
      state: {
        movie,
        selectedDate,
        selectedTheater,
        selectedTheaterId,
        selectedTime: selectedSeat.time, // Pass the selected time
        selectedSeatType: selectedSeat.type, // Pass the selected seat type
      },
    });
  };

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theaterData = await genericService.getTheaters();
        setTheaters(theaterData); // Adjust based on the structure of your API response
      } catch (error) {
        console.error('Failed to fetch theaters:', error);
      }
    };

    fetchTheaters();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', p: 2 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6">ShowTimes</Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h3" textAlign={'initial'} marginBottom={'10px'}>
            Select the cinema date you want to watch:
          </Typography>
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', mb: 2 }}>
            {generateDates().map((date, index) => (
              <Card
                key={index}
                variant={selectedDate === date ? 'contained' : 'outlined'}
                onClick={() => setSelectedDate(date)}
                sx={{
                  flex: '0 0 auto',
                  borderRadius: 2,
                  backgroundColor: selectedDate === date ? '#BBDEFB' : 'transparent',
                  color: selectedDate === date ? '#0D47A1' : 'inherit',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{date}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Typography variant="h3" textAlign={'initial'} marginBottom={'10px'}>
            Select Theater and Show:
          </Typography>
          <Stack spacing={2}>
            {theaters.map((theater) => (
              <Card
                key={theater.id}
                variant={selectedTheater === theater.name ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedTheater(theater.name);
                  setSelectedTheaterId(theater.theaterId); // Store the selected theater ID for future use
                  setSelectedSeat({ type: '', time: '' }); // Reset selected seat when changing theater
                }}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'start',
                  width: 'auto',
                  backgroundColor: selectedTheater === theater.name ? '#BBDEFB' : 'transparent',
                  color: selectedTheater === theater.name ? '#0D47A1' : 'inherit',
                }}
              >
                <CardContent sx={{ textAlign: 'start' }}>
                  <Typography variant="h4">{theater.name}</Typography>
                  <Typography variant="body1">{theater.address}</Typography>

                  <Box sx={{ mt: 1, display: 'block', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* GOLD Seat Timing */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      GOLD Seats - $50
                    </Typography>
                    {['11:00', '13:45', '15:40', '17:15', '21:00'].map((time) => (
                      <Button
                        key={`gold-${time}`}
                        variant={selectedTheater === theater.name && selectedSeat.type === 'Gold' && selectedSeat.time === time ? 'contained' : 'outlined'}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click event
                          setSelectedTheater(theater.name); // Automatically select the theater
                          setSelectedTheaterId(theater.theaterId); // Store the selected theater ID for future use
                          setSelectedSeat({ type: 'Gold', time }); // Set selected seat type and time
                        }}
                        sx={{
                          mr: 1,
                          mb: 1,
                          fontSize: '0.8rem',
                          backgroundColor: selectedTheater === theater.name && selectedSeat.type === 'Gold' && selectedSeat.time === time ? '#0D47A1' : 'transparent',
                          color: selectedTheater === theater.name && selectedSeat.type === 'Gold' && selectedSeat.time === time ? 'white' : '#0D47A1',
                          '&:hover': {
                            backgroundColor: selectedTheater === theater.name && selectedSeat.type === 'Gold' && selectedSeat.time === time ? '#0D47A1' : 'transparent',
                          },
                        }}
                      >
                        {time}
                      </Button>
                    ))}

                    {/* Regular Seat Timing */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                      Regular Seats - $30
                    </Typography>

                    {['11:00', '13:45', '15:40', '17:15', '21:00'].map((time) => (
                      <Button
                        key={`regular-${time}`} // Unique key for regular seat buttons
                        variant={selectedTheater === theater.name && selectedSeat.type === 'Regular' && selectedSeat.time === time ? 'contained' : 'outlined'}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click event
                          setSelectedTheater(theater.name); // Automatically select the theater
                          setSelectedTheaterId(theater.theaterId); // Store the selected theater ID for future use
                          setSelectedSeat({ type: 'Regular', time }); // Set selected seat type and time
                        }}
                        sx={{
                          mr: 1,
                          mb: 1,
                          fontSize: '0.8rem',
                          backgroundColor: selectedTheater === theater.name && selectedSeat.type === 'Regular' && selectedSeat.time === time ? '#0D47A1' : 'transparent',
                          color: selectedTheater === theater.name && selectedSeat.type === 'Regular' && selectedSeat.time === time ? 'white' : '#0D47A1',
                          '&:hover': {
                            backgroundColor: selectedTheater === theater.name && selectedSeat.type === 'Regular' && selectedSeat.time === time ? '#0D47A1' : 'transparent',
                          },
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box sx={{ p: 2, borderRadius: 2 }}>
            {movie?.poster && (
              <Card elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <CardMedia
                  component="img"
                  image={movie.poster}
                  alt={movie.title}
                  alignItems="center"
                  sx={{
                    borderRadius: '8px',
                    marginBottom: '25px',
                    width: 'auto', // Ensure the image takes the full width of the container
                    height: 'auto', // Set fixed height to 450px
                    objectFit: 'cover', // Ensures the entire image is visible without being cut off
                  }}
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
                    <Item>{movie.duration} mins</Item>
                  </Stack>
                  <Stack direction="row" spacing={4} display="flex" justifyContent="start">
                    <Item>Rating :</Item>
                    <Item>{movie.rating}</Item>
                  </Stack>
                  <Typography variant='h6' padding={'0px'}>
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBookTicket}
            disabled={!selectedSeat.time || !selectedSeat.type || !selectedTheater}
            sx={{ mt: 2 }}
          >
            Book Ticket
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieSchedule;
