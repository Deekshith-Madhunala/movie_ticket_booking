import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Stack,
  Chip,
  Container,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Rating from '@mui/material/Rating';
import genericService from '../../rest/GenericService';

const MovieSchedule = () => {
  const location = useLocation();
  const { movie } = location.state || {};
  const navigate = useNavigate();

  const value = React.useState(movie?.rating);

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
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
      <Container sx={{ padding: 4, background: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column', minHeight: 'auto' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h3" textAlign={'initial'} sx={{ mt: 4, ml: 8 }}>
            Select Theater and Showtime:
          </Typography>
          <Divider />
          <Grid container spacing={2} sx={{ mt: 3, ml: 7 }}>
            {/* Poster Section (4 Ratio) */}
            <Grid item xs={12} md={2} justifyItems={'center'}>
              <CardMedia
                component="img"
                image={movie.poster}
                alt={movie.title}
                sx={{
                  width: "100%", // Adjust the width of the poster
                  height: "100%", // Maintain aspect ratio
                  maxHeight: "250px", // Restrict the height
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
            </Grid>

            {/* Movie Details Section (6 Ratio) */}
            <Grid item xs={12} md={8}>
              <Box sx={{ borderRadius: 2, justifyItems: 'start' }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  {movie.title}
                </Typography>
                <Box justifyItems={'start'} display={'flex'} gap={1} mb={2}>
                  <Rating size="small" name="half-rating" value={value / 2} precision={0.5} readOnly />
                  <Typography variant="subtitle2" color="text.secondary">
                    {movie?.rating}/10
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(movie.releaseDate).getFullYear()}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {movie.duration} min
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                  {movie.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Genre: <span style={{ fontWeight: "normal" }}>{movie.genre}</span>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Dates Section */}
          <Box sx={{ minHeight: '100vh', p: 2, ml: 6, mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                  <Typography variant="h5">Select a Date:</Typography>
                </Typography>
                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', mb: 4 }}>
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

                {/* Theater section */}
                <Typography variant="subtitle1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                  <Typography variant="h5">Choose a Theater:</Typography>
                </Typography>
                <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="flex-start" mb={4}>
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
                        width: 350,
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

                <Typography variant="subtitle1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                  <Typography variant="h5">Choose a Showtime:</Typography>
                </Typography>

                {/* Showtimes Section */}
                <Stack spacing={2}>
                  {selectedTheaterId && timeSlots[selectedTheaterId] && (
                    <Grid container spacing={2}>
                      {timeSlots[selectedTheaterId].map((slot) => (
                        <Grid item key={slot.timeSlotId}>
                          <Button
                            fullWidth
                            size="large"
                            variant={selectedSeat.time === slot.timeSlot ? 'contained' : 'outlined'}
                            onClick={() => {
                              setSelectedSeat({ type: 'Regular', time: slot.timeSlot });
                              setShowTimes(slot.showtimeId);
                            }}
                            sx={{
                              width: '300px',
                              borderRadius: 2,
                              backgroundColor: selectedSeat.time === slot.timeSlot? '#BBDEFB' : 'transparent',
                              color: selectedSeat.time === slot.timeSlot? '#0D47A1' : 'inherit',
                            }}
                          >
                            {slot.timeSlot}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Stack>

                {/* Book Ticket Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookTicket}
                  sx={{ mt: 2, mb: 0 }} // Remove the bottom margin if present
                >
                  Book Ticket
                </Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </Container>
    </Box>
  );

};

export default MovieSchedule;
