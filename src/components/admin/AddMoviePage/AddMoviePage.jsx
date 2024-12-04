import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardMedia, Chip, TextField, Button, Container } from '@mui/material';
import genericService from '../../../rest/GenericService';
import { useSnackbar } from '../../snackBar/SnackbarContext';

const AddMoviePage = () => {
    const [newMovies, setNewMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [movieYear, setMovieYear] = useState('');
    const [movie, setMovie] = useState(null); // State to store fetched movie data
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message

    const value = 10;

    const showSnackbar = useSnackbar();


    // Fetch movie data based on title and year
    const fetchMovie = async (title, year) => {
        try {
            const movieData = await genericService.getMovie(title, year);
            if (movieData.Response === "False") {
                setErrorMessage('Movie not found. Please check the title and year.');
            } else {
                setMovie(movieData);  // Set the fetched movie data
                setErrorMessage(''); // Clear any previous error message
            }
            console.log('Fetched movie data:', movieData);
        } catch (error) {
            console.error('Failed to fetch movie data:', error);
            setErrorMessage('An error occurred while fetching the movie data.');
        }
    };

    const handleAddMovie = async (title, year) => {
        try {
            const response = await genericService.createMovie(title, year);
            if(response!=null){
                showSnackbar('Movie Added successfully!', 'success');
            }
        } catch (error) {
            console.error('Failed to add movie:', error);
            setErrorMessage('An error occurred while adding the movie.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (movieTitle) {
            setErrorMessage(''); // Clear any previous error message
            fetchMovie(movieTitle, movieYear);
        }
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>

            <Typography variant="h3" textAlign={'start'} sx={{ mt: 4, ml: 27, mb: 4 }}>
                Add Movie
            </Typography>
            <Container sx={{ p: 2, mb: 4, background: 'white', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 'auto' }}>

                {/* Movie Search Form */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ marginBottom: 5 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Movie Title"
                                value={movieTitle}
                                onChange={(e) => setMovieTitle(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Year"
                                value={movieYear}
                                onChange={(e) => setMovieYear(e.target.value)}
                                fullWidth
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ height: '100%' }}
                                fullWidth
                            >
                                Search Movie
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>

            <Container sx={{ background: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column', minHeight: 'auto' }}>
                {/* Show error message if no movie data or fetch failed */}
                {errorMessage && (
                    <Typography variant="h6" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Main Movie Display */}
                {movie && !errorMessage && (
                    <Grid container spacing={2} sx={{ marginBottom: 5 }}>
                        {/* Poster Section (4 Ratio) */}
                        <Grid item xs={12} md={4} justifyItems={'center'}>
                            <CardMedia
                                component="img"
                                image={movie.Poster} // Adjusted image URL for fetched movie
                                alt={movie.Title}
                                sx={{
                                    width: "70%",
                                    height: "100%",
                                    maxHeight: "500px",
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    margin: 3
                                }}
                            />
                        </Grid>

                        {/* Movie Details Section (6 Ratio) */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ borderRadius: 2, justifyItems: 'start' }}>
                                <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                                    {movie.Title}
                                </Typography>
                                <Box justifyItems={'start'} display={'flex'} gap={1} mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {movie.Year}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {movie.Runtime}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                                    {movie.Plot}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Genre: <span style={{ fontWeight: "normal" }}>{movie.Genre}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Director: <span style={{ fontWeight: "normal" }}>{movie.Director}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Writer: <span style={{ fontWeight: "normal" }}>{movie.Writer}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Actors: <span style={{ fontWeight: "normal" }}>{movie.Actors}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Language: <span style={{ fontWeight: "normal" }}>{movie.Language}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Country: <span style={{ fontWeight: "normal" }}>{movie.Country}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                    Awards: <span style={{ fontWeight: "normal" }}>{movie.Awards}</span>
                                </Typography>
                                <Chip
                                    label="Add Movie"
                                    onClick={() => handleAddMovie(movieTitle, movieYear)}
                                    size="medium"
                                    sx={{
                                        backgroundColor: "#000000",
                                        color: "#ffffff",
                                        fontSize: "1rem",
                                        height: "38px",
                                        padding: "0 16px",
                                        "& .MuiChip-icon": {
                                            fontSize: "1.5rem",
                                            color: "#ffffff",
                                        },
                                        cursor: "pointer",
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default AddMoviePage;
