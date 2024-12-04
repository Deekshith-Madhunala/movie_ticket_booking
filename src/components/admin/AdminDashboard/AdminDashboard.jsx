import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TheatersIcon from '@mui/icons-material/Theaters';
import genericService from '../../../rest/GenericService';

const AdminDashboard = () => {

    const [bookings, setBookings] = useState('');
    const [movies, setMovies] = useState('');
    const [schedules, setSchedules] = useState('');
    const [theaters, setTheaters] = useState('');

    // Example data for total counts
    const totalCounts = [
        { title: 'Total Bookings', count: 120 },
        { title: 'Total Movies', count: 50 },
        { title: 'Total Users', count: 300 },
    ];

    // Example data for movies and bookings
    const movieDetails = [
        { title: 'Inception', genre: 'Sci-Fi', rating: '9.0' },
        { title: 'Titanic', genre: 'Romance', rating: '8.5' },
    ];

    const bookingDetails = [
        { user: 'John Doe', movie: 'Inception', seats: 'A1, A2', date: '2024-12-05' },
        { user: 'Jane Smith', movie: 'Titanic', seats: 'B3, B4', date: '2024-12-06' },
    ];


    useEffect(() => {
        fetchAllDetails();
    }, []);


    const fetchAllDetails = async () => {
        try{
            // Fetch movie details
            const movieData = await genericService.getMovies();
            const theaterDetails = await genericService.getTheaters();
            const bookingData = await genericService.getAllBookings();
            const scheduleData = await genericService.getAllShowTimes();
            setMovies(movieData);
            setTheaters(theaterDetails);
            setBookings(bookingData);
            setSchedules(scheduleData);
        } catch (error) {
            console.error('Failed to add movie:', error);
        }
    }

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Typography variant="h4" textAlign="start">
                Dashboard
            </Typography>
            <Divider></Divider>

            {/* Cards and Tables */}
            <Grid container spacing={4} justifyContent="center" mt={1}>
                {/* Cards */}
                {totalCounts.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                padding: 2,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                width: '80%', // Full width within its grid
                                height: '130px',
                            }}
                        >
                            <CardContent sx={{ textAlign: 'start' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {item.count}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Movie Details Table */}
                <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Movie Details
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                            Add New Movie
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>Title</strong></TableCell>
                                    <TableCell><strong>Genre</strong></TableCell>
                                    <TableCell><strong>Rating</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movies.map((movie, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{movie.title}</TableCell>
                                        <TableCell>{movie.description}</TableCell>
                                        <TableCell>{movie.rating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Booking Details Table */}
                <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Booking Details
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<EventNoteIcon />}>
                            Add New Schedule
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>User</strong></TableCell>
                                    <TableCell><strong>Movie</strong></TableCell>
                                    <TableCell><strong>Seats</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{booking.user}</TableCell>
                                        <TableCell>{booking.movie}</TableCell>
                                        <TableCell>{booking.seats}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Theaters Icon */}
                <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Theaters Details
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<TheatersIcon />}>
                            Add New Theater
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>User</strong></TableCell>
                                    <TableCell><strong>Movie</strong></TableCell>
                                    <TableCell><strong>Seats</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {theaters.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{booking.name}</TableCell>
                                        <TableCell>{booking.address}</TableCell>
                                        <TableCell>{booking.seats}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
