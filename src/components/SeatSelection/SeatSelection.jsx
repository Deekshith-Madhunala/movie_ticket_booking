import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

const Item = styled(Typography)(({ theme }) => ({
    ...theme.typography.h6,
    padding: theme.spacing(0.5),
}));

const SeatSelection = () => {
    // Retrieve passed movie, theater, date, and time details using useLocation
    const location = useLocation();
    const { movie, selectedDate, selectedTime, selectedTheater, selectedSeatType, selectedTheaterId } = location.state || {};

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
                selectedTheaterId
            },
        });
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* Display Movie, Theater, Date, and Time details */}
            <Typography variant="h4" gutterBottom>
                Seat Selection for {movie?.title || "Movie Title"}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Theater: {selectedTheater} | Date: {selectedDate} | Time: {selectedTime} | Seat Type: {selectedSeatType}
            </Typography>

            <Grid container spacing={1} justifyContent="center" sx={{ mb: 4 }}>
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

            <Stack direction="row" spacing={4} display="flex" justifyContent="space-evenly" sx={{ mb: 2 }}>
                <Item>
                    <Typography variant='h4'>Total Price:</Typography>
                    <Typography variant='h5'>
                        ${selectedSeatType === 'Gold' ? (50 * selectedSeats.length) : (30 * selectedSeats.length)}
                    </Typography>
                </Item>
                <Item>
                    <Typography variant='h4'>Selected Seats:</Typography>
                    <Typography variant='h5'>{selectedSeats.join(', ')}</Typography>
                </Item>
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
    );
};

export default SeatSelection;
