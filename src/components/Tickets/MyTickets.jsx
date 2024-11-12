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

function MyTickets() {
  const [bookings, setBookings] = React.useState([]);
  const { user, logout } = useAuth();

  const userId = user.id;

  useEffect(() => {
    fetchBookings(); // Fetch bookings on component mount
  }, []); // Empty dependency array to run once on mount

  const fetchBookings = async () => {
    try {
      const bookings = await genericService.getBookingsByUserId(userId); // Fetch bookings by user ID
      setBookings(bookings); // Update the bookings state
      console.log('Bookings:', bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    console.log("Cancelling booking:", bookingId);

    try {
      await genericService.cancelBooking(bookingId); // Call the API to cancel the booking
      console.log('Booking canceled:', bookingId);

      // Remove the canceled booking from the state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.bookingId !== bookingId)
      );
    } catch (error) {
      console.error('Failed to cancel booking:', error.message);
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
                image={booking.movieDetails.poster} // Accessing poster from movieDetails
                alt={booking.movieDetails.title} // Accessing title from movieDetails
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
                  {booking.movieDetails.title} {/* Accessing title from movieDetails */}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Showtime:</strong> {booking.showtimeDetails.showtimeTime} on {new Date(booking.showtimeDetails.showDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Theater:</strong> {booking.theaterDetails.name}, {booking.theaterDetails.address}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Seat Type:</strong> {booking.showtimeDetails.seatType}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Seats Selected:</strong>
                  {booking.seatSelected ? booking.seatSelected.join(', ') : 'No seats selected'}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontSize: '1rem' }}>
                  Total Amount: ${booking.totalAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Status:</strong> {booking.bookingStatus}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelBooking(booking.bookingId)} // Call handleCancelBooking with bookingId
                  sx={{ mt: 2 }} // Margin top for spacing
                >
                  Cancel Booking
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
