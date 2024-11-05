// MovieCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  
  const navigate = useNavigate();

  const handleClick = () => {
      // Navigate to the movie schedule page using the movie title as the identifier
      navigate(`/movie-schedule/${movie.Title}`, { state: { movie } });
    };

  return (
    <Card onClick={handleClick} sx={{ maxWidth: 345, margin: 2, cursor: 'pointer', borderRadius: 8 }}>
      <CardMedia
        component="img"
        height="500px"        
        image={movie.poster}
        alt={movie.title}
        sx={{ borderRadius: 8 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
