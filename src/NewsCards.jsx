// NewsCards.jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import MovieCard from './MovieCard';

const movies = [
    {
        title: 'Movie 1',
        image: 'https://images.unsplash.com/photo-1726711340699-952d47133b21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D'
    },
    {
        title: 'Movie 2',
        image: 'https://images.unsplash.com/photo-1726711340699-952d47133b21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D'
    },
    {
        title: 'Movie 3',
        image: 'https://images.unsplash.com/photo-1726711340699-952d47133b21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D'
    },

];

const NewsCards = () => {
    return (
        <React.Fragment>
            <Container>
                <h2>Newscards</h2>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                    }}
                >
                    {movies.map((movie, index) => (
                        <Box key={index} sx={{ flex: '1 1 30%', margin: '10px' }}>
                            <MovieCard movie={movie} />
                        </Box>
                    ))}
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default NewsCards;