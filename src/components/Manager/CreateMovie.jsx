import React, { useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Snackbar,
    Typography,
    TextField,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';
import genericService from '../../rest/GenericService';

function CreateMovie() {
    // States for form inputs
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [seatType, setSeatType] = useState('Regular'); // New state for seat type
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);

    // Fetch movies, theaters, and timeslots on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesData = await genericService.getMovies();
                const theatersData = await genericService.getTheaters();
                const timeSlotsData = await genericService.getTimeSlots();

                setMovies(moviesData);
                setTheaters(theatersData);
                setTimeslots(timeSlotsData); // Set the timeslots state
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch movies, theaters, or timeslots.');
            }
        };

        fetchData();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validate the input
        if (selectedMovie && selectedTheater && selectedTimeSlot && selectedDate && price) {
            try {
                // Create the showtime
                const showtimeData = {
                    movie: selectedMovie, // Ensure this is movieId
                    theater: selectedTheater, // Ensure this is theaterId
                    showDate: selectedDate,
                    showtimeTime: selectedTimeSlot,
                    price: parseFloat(price),
                };

                await genericService.createShowTimes(showtimeData);
                
                // Show success message
                setSuccessMessage(`Showtime for the movie created successfully!`);

                // Show alert with showtime data in JSON format
                alert(JSON.stringify(showtimeData, null, 2));
            } catch (error) {
                console.error('Error creating showtime:', error);
                setError(error.message || 'An error occurred while creating the showtime.');
            }
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <div>
            <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', marginTop: 4 }}>
                <CardHeader title="Create Showtime" subheader="Fill in the details below" />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Movie</InputLabel>
                                    <Select
                                        value={selectedMovie}
                                        onChange={(e) => setSelectedMovie(e.target.value)} // Set movieId
                                        required
                                    >
                                        {movies.map((movie) => (
                                            <MenuItem key={movie.movieId} value={movie.movieId}> {/* Use movieId here */}
                                                {movie.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Theater</InputLabel>
                                    <Select
                                        value={selectedTheater}
                                        onChange={(e) => setSelectedTheater(e.target.value)} // Set theaterId
                                        required
                                    >
                                        {theaters.map((theater) => (
                                            <MenuItem key={theater.theaterId} value={theater.theaterId}> {/* Use theaterId here */}
                                                {theater.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Time Slot</InputLabel>
                                    <Select
                                        value={selectedTimeSlot}
                                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                        required
                                    >
                                        {timeslots.map((time) => (
                                            <MenuItem key={time.id} value={time.id}>
                                                {time.timeSlot}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Seat Type</InputLabel>
                                    <Select
                                        value={seatType}
                                        onChange={(e) => setSeatType(e.target.value)} // Update seat type
                                        required
                                    >
                                        <MenuItem value="Regular">Regular</MenuItem>
                                        <MenuItem value="Gold">Gold</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Add Showtime
                        </Button>
                    </form>

                    {error && (
                        <Snackbar
                            open={true}
                            message={error}
                            autoHideDuration={6000}
                            onClose={() => setError(null)}
                        />
                    )}
                    {successMessage && (
                        <Snackbar
                            open={true}
                            message={successMessage}
                            autoHideDuration={6000}
                            onClose={() => setSuccessMessage('')}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateMovie;
