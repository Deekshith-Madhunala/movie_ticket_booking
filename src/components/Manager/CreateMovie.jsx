import React, { useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    TextField,
    Card,
    CardContent,
    CardHeader,
    Box,
    Container,
} from '@mui/material';
import genericService from '../../rest/GenericService';
import { useSnackbar } from '../snackBar/SnackbarContext';
import { useAuth } from '../../auth/AuthContext';

function CreateMovie() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [seats, setSeat] = useState('');
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);

    const [movieName, setMovieName] = useState('');
    const [year, setYear] = useState('');
    const [isManager, setIsManager] = useState(false); // State to check if the user is a manager
    const showSnackbar = useSnackbar();
    const { user } = useAuth(); // Logged-in user details

    const formatTo12Hour = (time24) => {
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    const handleTheaterChange = (e) => {
        const selectedTheaterId = e.target.value;
        setSelectedTheater(selectedTheaterId);

        // Find the selected theater from the theaters array
        const selectedTheaterObj = theaters.find(
            (theater) => theater.theaterId === selectedTheaterId
        );

        // Update the seats state based on the selected theater's totalSeats
        if (selectedTheaterObj) {
            setSeat(selectedTheaterObj.totalSeats);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesData = await genericService.getMovies();
                const theatersData = await genericService.getTheaters();
                const timeSlotsData = await genericService.getTimeSlots();
                const usersData = await genericService.getAllUsers();

                setMovies(moviesData);
                setTheaters(theatersData);
                setTimeslots(timeSlotsData);
                setUsers(usersData);

                // Check if the logged-in user is a manager
                const loggedInUser = usersData.find(u => u.firstName === user.firstName);
                console.log('theater = ', theatersData);

                console.log('logged in user = ', loggedInUser);
                if (loggedInUser && loggedInUser.role === 'ADMIN') {
                    setIsManager(true);
                }

                if (loggedInUser && loggedInUser.role === 'MANAGER') {
                    // Find all theaters where the logged-in user is a manager
                    const theatersManager = theatersData.filter(theater => {
                        if (Array.isArray(theater.managers)) {
                            // If "managers" is an array
                            return theater.managers.includes(user.userId);
                        } else if (theater.manager) {
                            // If "manager" is a single value
                            return theater.manager === user.userId;
                        }
                        return false;
                    });

                    if (theatersManager.length > 0) {
                        console.log('Theaters Managed by User:', theatersManager);
                        setTheaters(theatersManager); // Set only the theaters managed by the user
                    } else {
                        console.log('No theaters managed by this user.');
                        setTheaters([]); // Clear theaters if no match
                    }
                }


            } catch (error) {
                console.error('Error fetching data:', error);
                showSnackbar('Failed to fetch data.', 'failure');
                setError('Failed to fetch data.');
            }
        };

        fetchData();
    }, [user, showSnackbar]);

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            await genericService.createMovie(movieName, parseInt(year, 10));
            showSnackbar('Movie created successfully!', 'success');
            setMovieName('');
            setYear('');
        } catch (error) {
            console.error('Error creating movie:', error);
            setError(error.message || 'An error occurred while creating the movie.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (selectedMovie && selectedTheater && selectedTimeSlots.length > 0 && selectedStartDate && selectedEndDate && price) {
            try {
                const showtimeData = {
                    movie: selectedMovie,
                    theater: selectedTheater,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                    timeSlotIds: selectedTimeSlots,
                    price: parseFloat(price),
                    availableSeats: seats,
                };

                await genericService.createShowTimes(showtimeData);
                showSnackbar('Showtime created successfully!', 'success');

                // Clear the form fields by resetting the state
                setSelectedMovie('');
                setSelectedTheater('');
                setSelectedTimeSlots([]);
                setSelectedStartDate('');
                setSelectedEndDate('');
                setPrice('');
                setSeat('');
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
                <Card variant="outlined" sx={{ maxWidth: '600px' }}>
                    <CardHeader title="Create Showtime" subheader="Fill in the details below" />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Movie</InputLabel>
                                        <Select
                                            value={selectedMovie}
                                            onChange={(e) => setSelectedMovie(e.target.value)}
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
                                            onChange={handleTheaterChange}
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
                                            onChange={(e) => setSelectedTimeSlots(e.target.value)}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((id) =>
                                                        formatTo12Hour(timeslots.find((t) => t.timeSlotId === id).timeSlot)
                                                    )
                                                    .join(', ')
                                            }
                                            required
                                        >
                                            {timeslots.map((time) => (
                                                <MenuItem key={time.timeSlotId} value={time.timeSlotId}>
                                                    {formatTo12Hour(time.timeSlot)}
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
                                        InputProps={{
                                            readOnly: true, // Makes the field read-only
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Add Showtime
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default CreateMovie;
