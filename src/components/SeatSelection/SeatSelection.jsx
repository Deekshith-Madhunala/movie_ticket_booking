import React, { useState } from 'react';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import dayjs from 'dayjs';
import 'dayjs/locale/en';

const SeatSelection = () => {
    // Retrieve passed movie, theater, date, and time details using useLocation
    const location = useLocation();
    const { movie, selectedDate, selectedTime, selectedTheater, selectedSeatType, selectedTheaterId, selectedSchedule, price } = location.state || {};

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':'); // Assuming time is in "HH:mm" format
        let hour = parseInt(hours, 10);
        const minute = minutes;

        const suffix = hour >= 12 ? 'PM' : 'AM';
        hour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour; // Convert to 12-hour format

        return `${hour}:${minute} ${suffix}`; // Return time in "hh:mm AM/PM" format
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;
    };

    // Format the selected date
    const formattedDate = selectedDate ? dayjs(selectedDate).format("ddd, MMM D, YYYY") : "Movie Date";

    // Format the selected time (if available)
    const formattedTime = selectedTime ? formatTime(selectedTime) : "";

    const navigate = useNavigate(); // Hook to navigate to another route

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);

    // Function to dynamically create seat labels (e.g., A1, A2, ..., H20)
    const createSeatLayout = (rows, cols) => {
        const layout = [];
        const rowLabels = 'ABCDEFGH'; // Define row labels

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 1; j <= cols; j++) {
                row.push(`${rowLabels[i]}${j < 10 ? '0' + j : j}`);
            }
            layout.push(row);
        }

        return layout;
    };

    // Generate a layout with 8 rows and 15 columns
    const seatLayout = createSeatLayout(8, 15);

    // Handle seat selection
    const toggleSeat = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    // Handle booking of selected seats and navigate to ConfirmPayment page
    const bookSeats = () => {
        setBookedSeats([...bookedSeats, ...selectedSeats]);
        // Navigate to ConfirmPayment page and pass the selected seats and other details
        navigate('/confirm-payment', {
            state: {
                movie,
                selectedDate,
                selectedTime,
                selectedTheater,
                selectedSeats,
                selectedSeatType,
                selectedTheaterId,
                selectedSchedule,
                price: (price * selectedSeats.length)
            },
        });
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h3" textAlign={'start'} sx={{ mt: 4, ml: 27, mb: 4 }}>
                Select Your Seats
            </Typography>
            <Container sx={{ p: 2, mb: 4, background: 'white', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
                    <Typography variant="h5" gutterBottom component="div" fontWeight={600}>
                        {movie?.title || "Movie Title"}
                    </Typography>
                    <Typography variant="body1" component="div">
                        {formattedDate}  <span> &bull; </span> {formattedTime}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'start' }}>
                    <Typography variant="body1" gutterBottom>
                        {selectedTheater}
                    </Typography>
                    <Typography variant="body1">
                        Duration: {formatDuration(movie.duration)}
                    </Typography>
                </Box>
            </Container>


            <Container sx={{ background: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column', minHeight: 'auto' }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    {/* Display Movie, Theater, Date, and Time details */}
                    <Button disabled sx={{ m: 4, width: '90%', backgroundColor: '#ccc', textTransform: 'none' }}>Screen</Button>

                    <Grid container spacing={1} justifyContent="center" sx={{ mb: 4, mt: 8 }}>
                        {seatLayout.map((row, rowIndex) => (
                            <Grid container item key={rowIndex} justifyContent="center" spacing={1}>
                                {row.map((seat) => (
                                    <Grid item key={seat}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => toggleSeat(seat)}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: bookedSeats.includes(seat)
                                                    ? '#e0e0e0' // Grey for booked seats
                                                    : selectedSeats.includes(seat)
                                                        ? '#1976d2' // Blue for selected seats
                                                        : '#ffffff', // White for available seats
                                                color: bookedSeats.includes(seat)
                                                    ? '#000' // Black text for booked seats
                                                    : selectedSeats.includes(seat)
                                                        ? '#fff' // White text for selected seats
                                                        : '#000', // Black text for available seats
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px', // Adjust font size if needed
                                            }}
                                            disabled={bookedSeats.includes(seat)} // Disable button for booked seats
                                        >
                                            {seat}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                    </Grid>
                    <Divider />

                    <Stack direction="column" spacing={2} sx={{ m: 2 }}>
                        {/* Booking Summary Header */}
                        <Typography variant="h5" gutterBottom component="div" fontWeight={600} textAlign={"start"} margin={2}>
                            Booking Summary
                        </Typography>

                        {/* Selected Seats */}
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1" gutterBottom component="div">
                                    Selected Seats:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">{selectedSeats.join(', ')}</Typography>
                            </Grid>
                        </Grid>

                        {/* Total Price */}
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1" gutterBottom component="div">
                                    Total Price:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    ${selectedSeatType === 'Gold' ? (price * selectedSeats.length) : (price * selectedSeats.length)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>

                    <Button
                        variant="contained"
                        size='large'
                        color="secondary"
                        style={{ marginTop: '20px' }}
                        onClick={bookSeats} // Call bookSeats to proceed to ConfirmPayment
                        disabled={selectedSeats.length === 0}
                    >
                        Book Selected Seats
                    </Button>
                </div>
            </Container>
        </Box>
    );
};

export default SeatSelection;
