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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
  const [timeSlots, setTimeSlots] = useState([]);

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

  const fetchShowSchedules = async (date) => {
    try {
      const schedules = await genericService.getShowShedulesByDate(date);
      const filteredSchedules = schedules.filter(schedule => schedule.movie === movie.movieId);

      const allTimeSlots = await Promise.all(filteredSchedules.map(async (schedule) => {
        const timeSlotsData = await genericService.getTimeSlotsByShowtime(schedule.showtimeId);
        return timeSlotsData.map(slot => ({ timeSlotId: slot.timeSlotId, timeSlot: slot.timeSlot }));
      }));
      setTimeSlots(allTimeSlots.flat());
    } catch (error) {
      console.error('Failed to fetch show schedules:', error);
    }
  };

  useEffect(() => {
    fetchTheaters();
    const firstDate = dates[0];
    setSelectedDate(firstDate);
    fetchShowSchedules(firstDate);
  }, []);

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
                renderInput={(params) => <TextField {...params} fullWidth
                sx={{flex: '0 0 auto'}} 
                />}
              />
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
                    width: 'auto',
                    backgroundColor: selectedTheater === theater.name ? '#BBDEFB' : 'transparent',
                    color: selectedTheater === theater.name ? '#0D47A1' : 'inherit',
                  }}
                >
                  <CardContent sx={{ textAlign: 'start' }}>
                    <Typography variant="h4">{theater.name}</Typography>
                    <Typography variant="body1">{theater.address}</Typography>

                    <Box sx={{ mt: 1, display: 'block', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                                e.stopPropagation();
                                setSelectedTheater(theater.name);
                                setSelectedTheaterId(theater.theaterId);
                                setSelectedSeat({ type: 'Regular', time: slot.timeSlot });
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
                <CardMedia
                  component="img"
                  image={movie.poster}
                  alt={movie.title}
                  sx={{ height: '500px', objectFit: 'contain', marginBottom: 2 }}
                />
              )}
              <Typography variant="h5">{movie?.title}</Typography>
              <Button variant="contained" onClick={handleBookTicket} sx={{ mt: 2 }}>
                Book Ticket
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default MovieSchedule;
