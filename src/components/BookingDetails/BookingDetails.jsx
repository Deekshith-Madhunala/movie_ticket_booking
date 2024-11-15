import React from 'react';
import { Box, Grid, Typography, Card, CardMedia, Rating, Chip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const BookingDetails = () => {
    const location = useLocation();
    const movie = location.state?.movie;
    const value = movie?.rating;
    const navigate = useNavigate();

    // Fallback for when no movie data is passed
    if (!movie) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center' }}>
                <Typography variant="h4">No movie details available</Typography>
            </Box>
        );
    }
    const handleClick = () => {
        // Navigate to booking page with movie data
        navigate(`/movie-schedule/${movie.title}`, { state: { movie } });
    };

    const similarMovies = [
        { poster: "https://via.placeholder.com/300x450", title: "Movie 1" },
        { poster: "https://via.placeholder.com/300x450", title: "Movie 2" },
        { poster: "https://via.placeholder.com/300x450", title: "Movie 3" },
        { poster: "https://via.placeholder.com/300x450", title: "Movie 3" },
    ];

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
            {/* Main Container */}
            <Grid container spacing={2} sx={{ marginBottom: 5 }}>
                {/* Poster Section (4 Ratio) */}
                <Grid item xs={12} md={4} justifyItems={'center'}>
                    <CardMedia
                        component="img"
                        image={movie.poster}
                        alt={movie.title}
                        sx={{
                            width: "70%", // Adjust the width of the poster
                            height: "100%", // Maintain aspect ratio
                            maxHeight: "500px", // Restrict the height
                            borderRadius: 2,
                            objectFit: "cover",
                        }}
                    />
                </Grid>

                {/* Movie Details Section (6 Ratio) */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ borderRadius: 2, justifyItems: 'start' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                            {movie.title}
                        </Typography>
                        <Box justifyItems={'start'} display={'flex'} gap={1} mb={2}>
                            <Rating size="small" name="half-rating" value={value / 2} precision={0.5} readOnly />
                            <Typography variant="subtitle2" color="text.secondary">
                                {movie?.rating}/10
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                {new Date(movie.releaseDate).getFullYear()}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                {movie.duration} min
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                            {movie.description}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                            Genre: <span style={{ fontWeight: "normal" }}>{movie.genre}</span>
                        </Typography>
                        <Chip
                            label="Book Now"
                            onClick={handleClick}
                            size='medium'
                            sx={{
                                backgroundColor: "#000000", // Custom background color
                                color: "#ffffff", // Custom text color
                                fontSize: "1rem", // Increases text size
                                height: "38px", // Adjust chip height
                                padding: "0 16px", // Adds horizontal padding
                                "& .MuiChip-icon": {
                                    fontSize: "1.5rem", // Increases icon size
                                    color: "#ffffff", // Icon color
                                },
                                cursor: "pointer", // Pointer cursor for better UX
                            }} />
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: 'start', ml: 5 }}>
                Similar Movies
            </Typography>
            {/* Similar Movies Section */}
            <Box>
                <Grid container spacing={2} padding={5}>
                    {similarMovies.map((similar, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ width: "90%", borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    image={similar.poster}
                                    alt={similar.title}
                                    sx={{ height: 500 }}
                                />
                                {/* <CardContent>
                                    <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: "bold" }}>
                                        {similar.title}
                                    </Typography>
                                </CardContent> */}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default BookingDetails;
