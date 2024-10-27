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

  const [selectedDate, setSelectedDate] = useState(''); // Initialize with empty string
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState({ type: '', time: '' });
  const [theaters, setTheaters] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]); // State for time slots

  // Generate dates for the next week
  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Format the date as 'yyyy-mm-dd'
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`; // Return formatted date
    });
  };
  
  const dates = generateDates(); // Generate dates here

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

  const fetchTheaters = async () => {
    try {
      const theaterData = await genericService.getTheaters(); // Make sure to implement this in genericService
      setTheaters(theaterData);
    } catch (error) {
      console.error('Failed to fetch theaters:', error);
    }
  };

  const fetchShowSchedules = async (date) => {
    console.log("Fetching schedules" + date);
    
    try {
      const schedules = await genericService.getShowShedulesByDate(date);
      // For each schedule, fetch the corresponding time slots
      const allTimeSlots = await Promise.all(schedules.map(async (schedule) => {
        const timeSlotsData = await genericService.getTimeSlotsByShowtime(schedule.showtimeId);
        return timeSlotsData.map(slot => ({ timeSlotId: slot.timeSlotId, timeSlot: slot.timeSlot }));
      }));
      // Flatten the array and update the timeSlots state
      setTimeSlots(allTimeSlots.flat());
    } catch (error) {
      console.error('Failed to fetch show schedules:', error);
    }
  };

  useEffect(() => {
    fetchTheaters();
    const firstDate = dates[0]; // Get the first date
    setSelectedDate(firstDate); // Set it as the selected date
    fetchShowSchedules(firstDate); // Fetch schedules for the first date
  }, []); // Run only once on component mount

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
            {dates.map((date, index) => (
              <Card
                key={index}
                variant={selectedDate === date ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedDate(date);
                  fetchShowSchedules(date); // Fetch schedules when a date is selected
                }}
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
                    {/* Display dynamic time slots based on selection */}
                    {timeSlots.length > 0 ? (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Select Showtime:
                        </Typography>
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.timeSlotId}
                            variant={selectedTheater === theater.name && selectedSeat.time === slot.timeSlot ? 'contained' : 'outlined'}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card click event
                              setSelectedTheater(theater.name); // Automatically select the theater
                              setSelectedTheaterId(theater.theaterId); // Store the selected theater ID for future use
                              setSelectedSeat({ type: 'Regular', time: slot.timeSlot }); // Set selected seat type and time
                            }}
                            sx={{
                              mr: 1,
                              mb: 1,
                              fontSize: '0.8rem',
                              backgroundColor: selectedTheater === theater.name && selectedSeat.time === slot.timeSlot ? '#0D47A1' : 'transparent',
                              color: selectedTheater === theater.name && selectedSeat.time === slot.timeSlot ? 'white' : '#0D47A1',
                              '&:hover': {
                                backgroundColor: selectedTheater === theater.name && selectedSeat.time === slot.timeSlot ? '#0D47A1' : 'transparent',
                              },
                            }}
                          >
                            {slot.timeSlot}
                          </Button>
                        ))}
                      </>
                    ) : (
                      <Typography variant="body2">No showtimes available for this date.</Typography>
                    )}
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
                  sx={{ borderRadius: 2 }}
                />
              </Card>
            )}
            <Button variant="contained" onClick={handleBookTicket} sx={{ mt: 2 }}>
              Book Ticket
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieSchedule;
