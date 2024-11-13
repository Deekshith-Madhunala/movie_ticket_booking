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
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Rating from '@mui/material/Rating';
import genericService from '../../rest/GenericService';

const Item = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(0.5),
}));

const MovieSchedule = () => {
  const location = useLocation();
  const { movie } = location.state || {};
  const navigate = useNavigate();

  const [value, setValue] = React.useState(6.6);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState({ type: '', time: '' });
  const [theaters, setTheaters] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [showtimes, setShowTimes] = useState('');
  const [price, setPrice] = useState('');

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return dayjs(date).format('YYYY-MM-DD');
    });
  };

  const dates = generateDates();

  const handleBookTicket = () => {
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
        selectedTime: selectedSeat.time,
        selectedSeatType: selectedSeat.type,
        selectedSchedule: showtimes,
        price
      },
    });
  };

  const fetchTheaters = async () => {
    try {
      const theaterData = await genericService.getTheaters();
      setTheaters(theaterData);
    } catch (error) {
      console.error('Failed to fetch theaters:', error);
    }
  };

  const [schedulePrices, setSchedulePrices] = useState({});

  const fetchShowSchedules = async (date) => {
    try {
      const schedules = await genericService.getShowShedulesByDate(date);
      const filteredSchedules = schedules.filter(schedule => schedule.movie === movie.movieId);

      // Extract unique theater IDs from filtered schedules
      const theaterIdsInSchedule = new Set(filteredSchedules.map(schedule => schedule.theater));

      // Filter theaters based on theater IDs present in schedules
      const theaterData = await genericService.getTheaters();
      const matchingTheaters = theaterData.filter(theater => theaterIdsInSchedule.has(theater.theaterId));
      setTheaters(matchingTheaters);

      // Initialize a map to store time slots specific to each theater
      const timeSlotMap = {};

      // Map to store prices for each showtime
      const pricesMap = {};

      // Fetch and organize time slots by theater
      await Promise.all(
        filteredSchedules.map(async (schedule) => {
          const timeSlotsData = await genericService.getTimeSlotsByShowtime(schedule.showtimeId);

          // Store the price for each showtime
          pricesMap[schedule.theater] = schedule.price;

          // Only include time slots for this specific theater
          if (!timeSlotMap[schedule.theater]) {
            timeSlotMap[schedule.theater] = [];
          }

          // Add the time slots for this specific showtime to the theater's time slots list
          timeSlotMap[schedule.theater] = [
            ...timeSlotMap[schedule.theater],
            ...timeSlotsData.map(slot => ({
              timeSlotId: slot.timeSlotId,
              timeSlot: slot.timeSlot,
              showtimeId: schedule.showtimeId,
            }))
          ];
        })
      );

      setTimeSlots(timeSlotMap); // Set the time slots organized by theater ID
      setSchedulePrices(pricesMap); // Set the prices by showtime ID
    } catch (error) {
      console.error('Failed to fetch show schedules:', error);
    }
  };

  useEffect(() => {
    if (selectedTheaterId) {
      setPrice(schedulePrices[selectedTheaterId] || '');
    }
  }, [selectedTheaterId, schedulePrices]);

  useEffect(() => {
    const initializeTheatersAndShowtimes = async () => {
      await fetchTheaters();
      const firstDate = dates[0];
      setSelectedDate(firstDate);
      await fetchShowSchedules(firstDate);
    };
    initializeTheatersAndShowtimes();
  }, []);

  useEffect(() => {
    // Set the first theater as selected by default if theaters are available
    if (theaters.length > 0) {
      const firstTheater = theaters[0];
      setSelectedTheater(firstTheater.name);
      setSelectedTheaterId(firstTheater.theaterId);
      setSelectedSeat({ type: '', time: '' });
    }
  }, [theaters]); // Runs whenever theaters data changes

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    fetchShowSchedules(formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    fetchShowSchedules(date);
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
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(newDate) => handleDateChange(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ flex: '0 0 auto' }} />}
              />
            </Stack>

            <Typography variant="h3" textAlign={'initial'} marginBottom={'10px'}>
              Select Theater and Show time:
            </Typography>
            <Stack direction="row" spacing={4} sx={{ display: 'flex' }}>
              {/* Theaters Section */}
              <Stack spacing={2} sx={{ flex: 1 }}>
                {theaters.map((theater) => (
                  <Card
                    key={theater.id}
                    variant={selectedTheater === theater.name ? 'contained' : 'outlined'}
                    onClick={() => {
                      setSelectedTheater(theater.name);
                      setSelectedTheaterId(theater.theaterId);
                      setSelectedSeat({ type: '', time: '' });
                    }}
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'start',
                      backgroundColor: selectedTheater === theater.name ? '#BBDEFB' : 'transparent',
                      color: selectedTheater === theater.name ? '#0D47A1' : 'inherit',
                    }}
                  >
                    <CardContent sx={{ textAlign: 'start', minHeight: '50px' }}>
                      <Typography variant="h5">{theater.name}</Typography>
                      <Typography variant="body1">{theater.address}</Typography>
                      <br />
                      <Typography>
                        <Chip
                          label="Chip Filled"
                          sx={{
                            backgroundColor: '#000000', // Custom background color
                            color: '#ffffff', // Custom text color
                          }}
                        />
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              {/* Showtimes Section */}
              <Stack spacing={2} sx={{ flex: 1 }}>
                {selectedTheaterId && timeSlots[selectedTheaterId] && (
                  <>
                    <Grid container spacing={2}>
                      {timeSlots[selectedTheaterId].map((slot) => (
                        <Grid item key={slot.timeSlotId}>
                          <Button
                            fullWidth
                            size="large"
                            variant={selectedSeat.time === slot.timeSlot ? 'contained' : 'outlined'}
                            onClick={() => {
                              setSelectedSeat({ type: 'Regular', time: slot.timeSlot })
                              setShowTimes(slot.showtimeId);
                            }} // Set a default type here
                          >
                            {slot.timeSlot}
                          </Button>

                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Poster Image */}
              {movie?.poster && (
                <CardMedia
                  component="img"
                  image={movie.poster}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: 450,
                    objectFit: 'cover',
                    borderRadius: 2,
                    marginBottom: 2,
                  }}
                />
              )}

              {/* Movie Details */}
              <Typography variant="h4" component="h2" gutterBottom>
                {movie?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {movie?.description}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Genre: {movie?.genre}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Rating: {movie?.rating}
              </Typography>
              <Rating name="half-rating" value={value / 2} precision={0.5} readOnly size="large" />
              <Typography variant="subtitle2" color="text.secondary">
                Runtime: {movie?.duration} mins
              </Typography>

              {/* Book Ticket Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleBookTicket}
                sx={{ mt: 2, width: '100%' }}
              >
                Book Ticket
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider >
  );
};

export default MovieSchedule;
