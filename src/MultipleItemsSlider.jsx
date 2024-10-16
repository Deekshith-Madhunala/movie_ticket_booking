import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Container from '@mui/material/Container';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from './MovieCard';
import './slick-custom.css';
import genericService from './rest/GenericService';

const MultipleItemsSlider = () => {
    const [movies, setMovies] = useState([]); // State to hold movie data

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Number of slides to show at once
        slidesToScroll: 1, // Number of slides to scroll at once
    };

    // Function to fetch movie data and prevent duplicate creations
    const fetchMovie = async () => {
        try {
            const movieData = await genericService.getMovies();
            setMovies(movieData); // Update state with fetched movie data
            // console.log(movieData);
            
            // Check if the movie already exists in the backend
            // const allMovies = await genericService.getMovies();
            // const movieExists = allMovies.some(movie => movie.title === movieData.Title);
            
            // if (!movieExists) {
            //     const createdMovie = await genericService.createMovie(movieData);
            //     console.log("Movie created:", createdMovie.title);
            // } else {
            //     console.log("Movie already exists in the database");
            // }
            
        } catch (error) {
            console.error('Failed to fetch movie data:', error);
        }
    };

    useEffect(() => {
        fetchMovie(); // Call the fetchMovie function when the component mounts
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <React.Fragment>
            <Container style={{ paddingTop: 20 }}>
                <Slider {...settings}>
                    {movies.length > 0 ? (
                        movies.map((movie, index) => (
                            <div key={index}>
                                <MovieCard movie={movie} />
                            </div>
                        ))
                    ) : (
                        <div>No movies found.</div>
                    )}
                </Slider>
            </Container>
        </React.Fragment>
    );
};

export default MultipleItemsSlider;
