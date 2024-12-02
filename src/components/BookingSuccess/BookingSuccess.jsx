import React from 'react';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
    const location = useLocation();
    const { movie, selectedDate, selectedTime, selectedTheater, selectedSeats, selectedSeatType, selectedTheaterId, price, selectedSchedule } = location.state || {};
    const navigate = useNavigate();

    const handleBackToHome = async () => {
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
                        Amount: {price + 4.8 + 7.5}
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
