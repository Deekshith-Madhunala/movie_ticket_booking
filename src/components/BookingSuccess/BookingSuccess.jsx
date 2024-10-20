import React from 'react';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import genericService from '../../rest/GenericService';

const BookingSuccess = () => {
    const location = useLocation();
    const { movie, selectedDate, selectedTime, selectedTheater, selectedSeats, selectedSeatType, selectedTheaterId, selectedTotalPrice } = location.state || {};
    const navigate = useNavigate();


    const handleBackToHome = async () => {

        console.log('Selected Date:', selectedDate);  // Debugging output
        console.log('Selected Time:', selectedTime);  // Debugging output


        // Generate the showtimeData
        const showtimeData = {
            showtimeTime: selectedTime,
            showDate: new Date(selectedDate).toISOString(), // Convert to ISO string
            seatSelected: selectedSeats,
            seatType: selectedSeatType,
            price: selectedTotalPrice,
            movie: movie.movieId,
            theater: selectedTheaterId,
        };

        const bookingData = {
            paymentStatus: "DONE",
            bookingStatus: "CONFIRMED",
            totalAmount: selectedTotalPrice,
            createdAt: new Date().toISOString(),
            cancelledAt: null,
            user: 10001, // Assuming user is logged in
            showtime: "" // Assuming showtime is created successfully
        };



        console.log(showtimeData);  // Output the result for debugging
        // Call the createShowTimes API
        try {
            const response = await genericService.createShowTimes(showtimeData);
            if (response != null) {
                bookingData.showtime = response;
                const bookingResponse = await genericService.createBooking(bookingData);
                console.log('Booking created successfullyyy:', bookingResponse);
            }         
            console.log('Booking created successfully:', response);
            alert('Booking created successfully!');
            // Navigate back to home or movie listing page after success
            navigate('/');
        } catch (error) {
            console.error('Error creating Booking:', error);
            alert('Failed to create showtime. Please try again.');
        }
        // Navigate back to home or movie listing page
        navigate('/');
    };


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* Success Message Card */}
            <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
                <CardContent>
                    <Typography variant="h4" color="primary" gutterBottom>
                        Ticket Successfully Booked!
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Movie: {movie?.title || "Movie Title"}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Theater: {selectedTheater}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Date: {selectedDate} | Time: {selectedTime}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Seats: {selectedSeats.join(', ')}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Seat type: {selectedSeatType}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Amount: {selectedTotalPrice}
                    </Typography>
                    <Typography variant="h6" color="green" gutterBottom>
                        Payment Status: Success
                    </Typography>
                </CardContent>
            </Card>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleBackToHome}
                style={{ marginTop: '20px' }}
            >
                Back to Home
            </Button>
        </div>
    );
};

export default BookingSuccess;
