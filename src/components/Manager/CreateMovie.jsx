import React, { useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Snackbar,
    TextField,
    Card,
    CardContent,
    CardHeader,
    Box,
    Container,
} from '@mui/material';
import genericService from '../../rest/GenericService';
import { useSnackbar } from '../snackBar/SnackbarContext';

function CreateMovie() {
    // States for form inputs
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]); // Changed to array for multiple values
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [seats, setSeat] = useState(''); // New state for seat type
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);

    const [movieName, setMovieName] = useState('');
    const [year, setYear] = useState('');
    const showSnackbar = useSnackbar();

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
                showSnackbar('Failed to fetch movies, theaters, or timeslots.', 'failure');

                setError('Failed to fetch movies, theaters, or timeslots.');
            }
        };

        fetchData();
    }, []);

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            await genericService.createMovie(movieName, parseInt(year, 10));

            // setSuccessMessage('Movie created successfully!');
            showSnackbar('Movie created successfully!', 'success');

            setMovieName('');
            setYear('');
        } catch (error) {
            console.error('Error creating movie:', error);
            setError(error.message || 'An error occurred while creating the movie.');
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validate the input
        if (selectedMovie && selectedTheater && selectedTimeSlots.length > 0 && selectedStartDate && selectedStartDate && price) {
            try {
                // Create the showtime
                const showtimeData = {
                    movie: selectedMovie, // Ensure this is movieId
                    theater: selectedTheater, // Ensure this is theaterId
                    // showDate: selectedDate,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                    timeSlotIds: selectedTimeSlots, // Use an array of timeSlotIds
                    price: parseFloat(price),
                    availableSeats: seats // Include seat type if needed
                };

                await genericService.createShowTimes(showtimeData);

                // Show success message
                // setSuccessMessage(`Showtime for the movie created successfully!`);
                showSnackbar('Showtime created successfully!', 'success');


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
        <Box sx={{ background: '#f5f5f5' }}>
            <Container sx={{ display: 'flex', gap: 2, padding: 4 }}>
                <Card variant="outlined" sx={{ maxWidth: "600px" }}>
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
                                                <MenuItem key={movie.movieId} value={movie.movieId}>
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
                                                <MenuItem key={theater.theaterId} value={theater.theaterId}>
                                                    {theater.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        value={selectedStartDate}
                                        onChange={(e) => setSelectedStartDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="End Date"
                                        type="date"
                                        value={selectedEndDate}
                                        onChange={(e) => setSelectedEndDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Time Slots</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedTimeSlots}
                                            onChange={(e) => setSelectedTimeSlots(e.target.value)} // Set timeSlotIds
                                            renderValue={(selected) => selected.map((id) => timeslots.find(t => t.timeSlotId === id).timeSlot).join(', ')} // Display selected timeslots
                                            required
                                        >
                                            {timeslots.map((time) => (
                                                <MenuItem key={time.timeSlotId} value={time.timeSlotId}>
                                                    {time.timeSlot}
                                                </MenuItem>
                                            ))}
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Seats"
                                        type="number"
                                        value={seats}
                                        onChange={(e) => setSeat(e.target.value)}
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
                <Card variant="outlined" sx={{ maxWidth: '600px', margin: 'auto' }}>
                    <CardHeader title="Add Movie" subheader="Fill in the details below" />
                    <CardContent>
                        <form onSubmit={handleCreateMovie}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Movie Name"
                                        variant="outlined"
                                        value={movieName}
                                        onChange={(e) => setMovieName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Year"
                                        type="number"
                                        variant="outlined"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Create Movie
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
            </Container>
        </Box>
    );
}

export default CreateMovie;
