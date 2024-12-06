import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardMedia, Chip, TextField, Button, Container } from '@mui/material';
import genericService from '../../../rest/GenericService';
import { useSnackbar } from '../../snackBar/SnackbarContext';

const AddMoviePage = () => {
    const [newMovies, setNewMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [movieYear, setMovieYear] = useState('');
    const [movie, setMovie] = useState(null); // State to store fetched movie data
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [isEditing, setIsEditing] = useState(false); // Flag to track edit mode

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
            if (response != null) {
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

    const handleEdit = () => {
        setIsEditing(true); // Toggle to edit mode
    };

    const handleSave = async () => {
        try {
            const updatedMovie = {
                ...movie,
                Title: movieTitle,
                Year: movie.Year,
                Genre: movie.Genre,
                Director: movie.Director,
                Writer: movie.Writer,
                Actors: movie.Actors,
                Language: movie.Language,
                Country: movie.Country,
                Awards: movie.Awards,
                duration: movie.Runtime,
                releaseDate: movie.Released
            };

            const response = await genericService.createMovie(updatedMovie); // Assuming you have an updateMovie API
            if (response) {
                showSnackbar('Movie details updated successfully!', 'success');
                setMovie(updatedMovie); // Update movie state with new values
                setIsEditing(false); // Exit edit mode
            }
        } catch (error) {
            console.error('Failed to update movie:', error);
            setErrorMessage('An error occurred while updating the movie.');
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
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="Movie Title"
                                            value={movieTitle}
                                            onChange={(e) => setMovieTitle(e.target.value)}
                                        />
                                    ) : (
                                        movie.Title
                                    )}
                                </Typography>

                                <Box justifyItems={'start'} display={'flex'} gap={1} mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Year"
                                                value={movieYear}
                                                onChange={(e) => setMovieYear(e.target.value)}
                                            />
                                        ) : (
                                            movie.Year
                                        )}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ marginBottom: 2, textAlign: 'start' }}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Plot"
                                            value={movie.Plot}
                                            onChange={(e) => setMovie({ ...movie, Plot: e.target.value })}
                                        />
                                    ) : (
                                        movie.Plot
                                    )}
                                </Typography>


                                {/* Editable Fields for Genre, Director, Writer, Actors, Language, Country, Awards */}
                                {['Genre', 'Director', 'Writer', 'Actors', 'Language', 'Country', 'Awards'].map((field) => (
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }} key={field}>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label={field}
                                                value={movie[field]}
                                                onChange={(e) => setMovie({ ...movie, [field]: e.target.value })}
                                            />
                                        ) : (
                                            <>
                                                {field}: <span style={{ fontWeight: "normal" }}>{movie[field]}</span>
                                            </>
                                        )}
                                    </Typography>
                                ))}

                                <Button
                                    variant="contained"
                                    onClick={isEditing ? handleSave : handleEdit}
                                    sx={{ mt: 2 }}
                                >
                                    {isEditing ? 'Save Changes' : 'Edit Movie'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default AddMoviePage;
