import React, { useEffect } from 'react';
import genericService from '../../rest/GenericService';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';


function MyTickets() {
  const [bookings, setBookings] = React.useState([]);
  const userId = 10001; // Replace with the actual user ID or retrieve it from context/state

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await genericService.getBookingsByUserId(userId); // Fetch bookings by user ID
        setBookings(bookings);
        console.log('Bookings:', bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [userId]); // Dependency array includes userId to refetch if it changes

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
                boxShadow: 2, // Reduced shadow for a more compact look
                width: '300px', // Set a specific width for the card
                padding: '10px', // Reduce padding for a smaller card
              }}
            >
              <CardMedia
                component="img"
                image={booking.movie.poster}
                alt={booking.movie.title}
                sx={{
                  borderRadius: '8px',
                  marginBottom: '10px', // Reduced margin
                  maxHeight: '320px', // Adjusted maximum height for the image
                  width: '100%', // Ensure the image takes the full width of the container
                  objectFit: 'cover', // Ensure the entire image is visible without being cut off
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}> {/* Reduced font size */}
                  {booking.movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}> {/* Reduced font size */}
                  <strong>Showtime:</strong> {booking.showtime.showtimeTime} on {new Date(booking.showtime.showDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Theater:</strong> {booking.theater.name}, {booking.theater.address}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Seat Type:</strong> {booking.showtime.seatType}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Seats Selected:</strong> {booking.showtime.seatSelected.join(', ')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontSize: '1rem' }}>
                  Total Amount: ${booking.totalAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <strong>Status:</strong> {booking.bookingStatus}
                </Typography>
              </CardContent>
            </Card>

          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyTickets;
