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
import genericService from '../../../rest/GenericService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [users, setUsers] = useState([]);
    const [schedules, setSchedules] = useState([]);

    // Example data for total counts
    const totalCounts = [
        { title: 'Total Bookings', count: bookings.length },
        { title: 'Total Movies', count: movies.length },
        { title: 'Total Users', count: users.length },
        { title: 'Total Theaters', count: theaters.length },
        { title: 'Total Schedules', count: schedules.length },
    ];

    useEffect(() => {
        fetchAllDetails();
    }, []);

    const fetchAllDetails = async () => {
        try {
            const movieData = await genericService.getMovies();
            const theaterDetails = await genericService.getTheaters();
            const bookingData = await genericService.getAllBookings();
            const userData = await genericService.getAllUsers();
            const scheduleData = await genericService.getAllShowTimes();
            console.log(scheduleData);


            setMovies(movieData);
            setTheaters(theaterDetails);
            setBookings(bookingData);
            setUsers(userData);
            setSchedules(scheduleData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };


    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Box sx={{ padding: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Dashboard Title */}
                <Typography variant="h4" textAlign="start">
                    Dashboard
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ paddingX: 3, paddingY: 1.5, textTransform: 'none' }}
                        onClick={() => navigate('/add-movie')}
                    >
                        Add Movie
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EventNoteIcon />}
                        sx={{ paddingX: 3, paddingY: 1.5, textTransform: 'none' }}
                        onClick={() => navigate('/create-schedule')}
                    >
                        Add Schedule
                    </Button>
                </Box>
            </Box>

            <Divider></Divider>

            {/* Cards and Tables */}
            <Grid container spacing={4} justifyContent="start" mt={1}>
                {/* Cards */}
                {totalCounts.map((item, index) => (
                    <Grid item xs={12} md={2} key={index}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                padding: 2,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                width: '90%', // Full width within its grid
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

                {/* Movie Details and Booking Details Tables (2 per row) */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Movie Details
                        </Typography>
                        {/* <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                            Add New Movie
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} sx={{ height: 300, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>Movie Id</strong></TableCell>
                                    <TableCell><strong>Title</strong></TableCell>
                                    <TableCell><strong>Release date</strong></TableCell>
                                    <TableCell><strong>Genre</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movies.map((movie, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{movie.movieId}</TableCell>
                                        <TableCell>{movie.title}</TableCell>
                                        <TableCell>{movie.releaseDate}</TableCell>
                                        <TableCell>{movie.genre}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Theater Details and Users Details Tables (Next row) */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Theaters Details
                        </Typography>
                        {/* <Button variant="contained" color="primary" startIcon={<TheatersIcon />}>
                            Add New Theater
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} sx={{ height: 300, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>Theater Id</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Address</strong></TableCell>
                                    <TableCell><strong>Seats</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {theaters.map((theater, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{theater.theaterId}</TableCell>
                                        <TableCell>{theater.name}</TableCell>
                                        <TableCell>{theater.address}</TableCell>
                                        <TableCell>{theater.totalSeats}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Bookings Details Table */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Booking Details
                        </Typography>
                        {/* <Button variant="contained" color="primary" startIcon={<TheatersIcon />}>
                            Add New Theater
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} sx={{ height: 300, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>Booking Id</strong></TableCell>
                                    <TableCell><strong>User</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Time</strong></TableCell>
                                    <TableCell><strong>Amount</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking, index) => {
                                    const bookingDate = new Date(booking.bookingDateAndTime);

                                    // Manually format the date
                                    const day = bookingDate.getDate().toString().padStart(2, '0');
                                    const month = (bookingDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
                                    const year = bookingDate.getFullYear();
                                    const formattedDate = `${month}/${day}/${year}`;

                                    // Manually format the time (12-hour format with AM/PM)
                                    let hours = bookingDate.getHours();
                                    const minutes = bookingDate.getMinutes().toString().padStart(2, '0');
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12;
                                    hours = hours ? hours : 12; // The hour '0' should be '12'
                                    const formattedTime = `${hours}:${minutes} ${ampm}`;

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{booking.bookingId}</TableCell>
                                            <TableCell>{booking.user}</TableCell>
                                            <TableCell>{formattedDate}</TableCell>
                                            <TableCell>{formattedTime}</TableCell>
                                            <TableCell>{booking.totalAmount}</TableCell>
                                            <TableCell>{booking.bookingStatus}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Users Details
                        </Typography>
                        {/* <Button variant="contained" color="primary" startIcon={<TheatersIcon />}>
                            Add New User
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} sx={{ height: 300, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>User Id</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Role</strong></TableCell>
                                    <TableCell><strong>Contact</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.userId}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Typography variant="h5" textAlign="start" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                            Schedule Details
                        </Typography>
                        {/* <Button variant="contained" color="primary" startIcon={<TheatersIcon />}>
                            Add New User
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} sx={{ height: 300, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell><strong>Schedule Id</strong></TableCell>
                                    <TableCell><strong>Start Date</strong></TableCell>
                                    <TableCell><strong>End Date</strong></TableCell>
                                    <TableCell><strong>Movie</strong></TableCell>
                                    <TableCell><strong>Theater</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedules.map((schedule, index) => {
                                    // Format the startDate
                                    const startDate = new Date(schedule.startDate);
                                    const startDay = startDate.getDate().toString().padStart(2, '0');
                                    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
                                    const startYear = startDate.getFullYear();
                                    const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;

                                    // Format the endDate
                                    const endDate = new Date(schedule.endDate);
                                    const endDay = endDate.getDate().toString().padStart(2, '0');
                                    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
                                    const endYear = endDate.getFullYear();
                                    const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{schedule.showtimeId}</TableCell>
                                            <TableCell>{formattedStartDate}</TableCell>
                                            <TableCell>{formattedEndDate}</TableCell>
                                            <TableCell>{schedule.movie}</TableCell>
                                            <TableCell>{schedule.theater}</TableCell>
                                            <TableCell>{schedule.price}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AdminDashboard;
