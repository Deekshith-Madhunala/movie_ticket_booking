// MovieCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the movie schedule page using the movie title as the identifier
    navigate(`/movie-schedule/${movie.title}`, { state: { movie } });
  };

  return (
    <Card onClick={handleClick} sx={{ maxWidth: '600px', margin: 2, cursor: 'pointer', borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="300px"
        image={movie.poster}
        alt={movie.title}
        // sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Box sx={{ justifyItems: 'start' }}>
          <Typography gutterBottom variant="h5" component="div" fontWeight={600}>
            {movie.title}
          </Typography>
          <Typography variant="body2" component="div">
            {movie.genre} <span> &bull; </span> {movie.duration} min
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1, fontSize: '1rem', textTransform: 'none' }}
        >
          Book Tickets
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
