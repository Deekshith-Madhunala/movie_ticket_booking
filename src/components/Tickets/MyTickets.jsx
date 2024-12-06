import React, { useEffect } from 'react';
import genericService from '../../rest/GenericService';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAuth } from '../../auth/AuthContext';
import { useSnackbar } from '../snackBar/SnackbarContext';

function MyTickets() {
  const [bookings, setBookings] = React.useState([]);
  const { user, logout } = useAuth();
  const showSnackbar = useSnackbar();
  const userId = user.id;

  useEffect(() => {
    fetchBookings(); // Fetch bookings on component mount
  }, []);

  const fetchBookings = async () => {
    try {
      const bookings = await genericService.getBookingsByUserId(userId); // Fetch bookings by user ID
      setBookings(bookings); // Update the bookings state
      console.log('Bookings:', bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId, bookingDateTime) => {
    console.log('Cancelling booking:', bookingId);

    const currentTime = new Date().getTime();
    const bookingTime = new Date(bookingDateTime.dateTime).getTime();

    const timeDifferenceInHours = (bookingTime - currentTime) / (1000 * 60 * 60);

    if (timeDifferenceInHours > 10) {
      try {
        await genericService.updateBookingStatus(bookingId); // Call the API to cancel the booking
        console.log('Booking canceled:', bookingId);

        // Refresh the bookings by fetching the updated data
        await fetchBookings();

        showSnackbar('Booking successfully canceled!', 'success');
      } catch (error) {
        console.error('Failed to cancel booking:', error.message);
        showSnackbar('Failed to cancel booking. Please try again.', 'error');
      }
    } else {
      showSnackbar(
        'Cancellation is only allowed at least 10 hours before the booking time!',
        'error'
      );
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">
        {bookings.length > 0 ? 'Your bookings:' : 'No bookings found.'}
      </Typography>
      <Grid container spacing={5} sx={{ mt: 2 }}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.bookingId}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                minHeight: '580px',
                boxShadow: 2,
                width: '300px',
                padding: '10px',
              }}
            >
              <CardMedia
                component="img"
                image={booking.movieDetails.poster}
                alt={booking.movieDetails.title}
                sx={{
                  borderRadius: '8px',
                  marginBottom: '10px',
                  maxHeight: '320px',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                  {booking.movieDetails.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Showtime:</strong> {booking.showtimeDetails.showtimeTime} on{' '}
                  {new Date(booking.showtimeDetails.showDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Theater:</strong> {booking.theaterDetails.name},{' '}
                  {booking.theaterDetails.address}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Seat Type:</strong> {booking.showtimeDetails.seatType}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Seats Selected:</strong>
                  {booking.seatSelected
                    ? booking.seatSelected.join(', ')
                    : 'No seats selected'}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontSize: '1rem' }}>
                  Total Amount: ${booking.totalAmount}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Status:</strong> {booking.bookingStatus}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Date:</strong>
                  {(() => {
                    const { dateTime } = booking.bookingDateAndTime;
                    const parsedDate = new Date(dateTime);

                    // If the date is invalid, return 'Invalid Date'
                    if (isNaN(parsedDate)) {
                      return 'Invalid Date';
                    }

                    // Format the date part (MM/DD/YYYY)
                    return parsedDate.toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    });
                  })()}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  <strong>Time:</strong>
                  {(() => {
                    const { dateTime } = booking.bookingDateAndTime;
                    const parsedDate = new Date(dateTime);

                    // If the time is invalid, return 'Invalid Time'
                    if (isNaN(parsedDate)) {
                      return 'Invalid Time';
                    }

                    // Format the time part (h:mm a, 12-hour format)
                    return parsedDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });
                  })()}
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    handleCancelBooking(
                      booking.bookingId,
                      booking.bookingDateAndTime
                    )
                  }
                  sx={{ mt: 2 }}
                  disabled={booking.bookingStatus !== 'CONFIRMED'} // Disable button if not confirmed
                >
                  {booking.bookingStatus === 'CONFIRMED' ? 'Cancel Booking' : 'Cancelled'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyTickets;
