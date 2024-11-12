import React, { useEffect, useState } from 'react';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Radio, RadioGroup, FormControlLabel, TextField, Card, CardContent, CardActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import genericService from '../../rest/GenericService';


const ConfirmPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movie, selectedDate, selectedTime, selectedTheater, selectedSeats, selectedSeatType, selectedTheaterId, selectedSchedule, price } = location.state || {};

    const { user, logout } = useAuth(); // Use authentication context

    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedTotalPrice, setSelectedTotalPrice] = useState('');
    const [openMethodDialog, setOpenMethodDialog] = useState(false);
    const [openCardDetailsDialog, setOpenCardDetailsDialog] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleOpenMethodDialog = () => setOpenMethodDialog(true);
    const handleCloseMethodDialog = () => setOpenMethodDialog(false);
    const handleOpenCardDetailsDialog = () => {
        if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
            setOpenMethodDialog(false);
            setOpenCardDetailsDialog(true);
        } else {
            // For PayPal or others, directly navigate to success
            navigateToSuccess();
        }
    };

    const handleCloseCardDetailsDialog = () => setOpenCardDetailsDialog(false);
    const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);
    const handleConfirmCardPayment = () => {
        setOpenCardDetailsDialog(false);
        navigateToSuccess();
    };

    // Function to navigate to BookingSuccess component
    const navigateToSuccess =  async () => {

        const bookingData = {
            paymentStatus: "DONE",
            bookingStatus: "CONFIRMED",
            totalAmount: price,
            createdAt: new Date().toISOString(),
            seatType: selectedSeatType,
            cancelledAt: null,
            user: user?.userId,
            showtime: selectedSchedule,
            seatSelected: selectedSeats
        };

        console.log(bookingData);
        try {
            const bookingResponse = await genericService.createBooking(bookingData);
            console.log('Booking created successfullyyy:', bookingResponse);
            alert('Booking created successfully!');
            // Navigate back to home or movie listing page after success
            navigate('/');
        } catch (error) {
            console.error('Error creating Booking:', error);
            alert('Failed to create showtime. Please try again.');
        }

        navigate('/booking-success', {
            state: { movie, selectedDate, selectedTime, selectedTheater, selectedSeats, selectedSeatType, selectedTheaterId, price, selectedSchedule}
        });
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* Movie and booking details card */}
            <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Confirm Payment for {movie?.title || "Movie Title"}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Theater: {selectedTheater} | Date: {selectedDate} | Time: {selectedTime}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Selected Seats: {selectedSeats.join(', ')}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Seat type: {selectedSeatType}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Total Price: {price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenMethodDialog}
                        style={{ margin: '0 auto' }}
                    >
                        Choose Payment Method
                    </Button>
                </CardActions>
            </Card>

            {/* Payment method dialog */}
            <Dialog open={openMethodDialog} onClose={handleCloseMethodDialog}>
                <DialogTitle>Select Payment Method</DialogTitle>
                <DialogContent>
                    <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                        <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                        <FormControlLabel value="debitCard" control={<Radio />} label="Debit Card" />
                        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMethodDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleOpenCardDetailsDialog} color="primary" disabled={!paymentMethod}>Next</Button>
                </DialogActions>
            </Dialog>

            {/* Card details dialog */}
            <Dialog open={openCardDetailsDialog} onClose={handleCloseCardDetailsDialog}>
                <DialogTitle>Enter Card Details</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Card Number" type="text" fullWidth value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    <TextField margin="dense" label="Expiry Date (MM/YY)" type="text" fullWidth value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    <TextField margin="dense" label="CVV" type="password" fullWidth value={cvv} onChange={(e) => setCvv(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCardDetailsDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleConfirmCardPayment} color="primary" disabled={!cardNumber || !expiryDate || !cvv}>Confirm Payment</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfirmPayment;
