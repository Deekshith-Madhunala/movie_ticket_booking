import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Container from '@mui/material/Container';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from './MovieCard';
import './slick-custom.css';
import genericService from './rest/GenericService';
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { LocalOffer, LocalShipping, HolidayVillage } from '@mui/icons-material';

const specialOffersData = [
    {
        title: "Exclusive Discount",
        description: "Get 20% off on your first purchase! Limited time offer.",
        icon: <LocalOffer sx={{ fontSize: 40, color: 'primary.main' }} />,
        banner: "https://assets-in.bmscdn.com/promotions/cms/creatives/1731584470926_transformersoneweb.jpg"
    },
    {
        title: "Free Shipping",
        description: "Enjoy free shipping on orders over $50.",
        icon: <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />,
        banner: "https://assets-in.bmscdn.com/promotions/cms/creatives/1731571973192_webplaycc.jpg"
    },
    {
        title: "Holiday Special",
        description: "Buy 2 get 1 free on all holiday items.",
        icon: <HolidayVillage sx={{ fontSize: 40, color: 'primary.main' }} />,
        banner: "https://assets-in.bmscdn.com/promotions/cms/creatives/1731589818655_freeaccessweb.jpg"
    }
];

const MultipleItemsSlider = () => {
    const [movies, setMovies] = useState([]); // State to hold movie data
    const [upcomingMovies, setUpcomingMovies] = useState([]); // State to hold movie data


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };
    const settingsBanner = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        className: "center",
        centerMode: true,
        centerPadding: "60px",
    };
    const settings2 = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
    };
    // Function to fetch movie data and prevent duplicate creations
    const fetchMovie = async () => {
        try {
            const movieData = await genericService.getMovies();
            const upcomingMovieData = await genericService.fetchUpcomingMovies();
            setMovies(movieData);
            setUpcomingMovies(upcomingMovieData);
        } catch (error) {
            console.error('Failed to fetch movie data:', error);
        }
    };

    useEffect(() => {
        fetchMovie(); // Call the fetchMovie function when the component mounts
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <React.Fragment>
            <Container maxWidth='xl'>

                {/* Banner */}
                <Box sx={{ my: 4, textAlign: 'center' }}>

                    <Slider {...settingsBanner}>
                        {specialOffersData.length > 0 ? (
                            specialOffersData.map((movie, index) => (
                                <div key={index}>
                                    <img
                                        src={movie.banner}
                                        alt="Banner"
                                        style={{
                                            width: '98%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div>No movies found.</div>
                        )}
                    </Slider>
                </Box>

                <Typography variant='h4' sx={{ textAlign: 'start', ml: 2 }} fontWeight={400}>
                    Now Showing
                </Typography>
                <Slider {...settings}>
                    {movies.length > 0 ? (
                        movies.sort(() => Math.random() - 0.5).map((movie, index) => (
                            <div key={index}>
                                <MovieCard movie={movie} />
                            </div>
                        ))
                    ) : (
                        <div>No movies found.</div>
                    )}
                </Slider>

                {/* Single Banner */}

                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <img
                        src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/stream-leadin-web-collection-202210241242.png"  // Replace with your banner image URL
                        alt="Banner"
                        style={{
                            width: '98%',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                    />
                </Box>
                {/* coming soon */}
                <Box>
                    <Typography variant="h4" sx={{ textAlign: 'start', m: 2 }} fontWeight={400}>
                        Coming Soon
                    </Typography>
                    <Slider {...settings2}>
                        {upcomingMovies && upcomingMovies.results && upcomingMovies.results.length > 0 ? (
                            upcomingMovies.results.sort(() => Math.random() - 0.5).map((movie, index) => (
                                <div key={index} style={{ margin: '5px' }}> {/* Reduced margin */}
                                    <Card sx={{ ml: 2, width: 180, height: 200, borderRadius: 2, overflow: 'hidden' }}> {/* Reduced size */}
                                        <CardMedia
                                            component="img"
                                            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Map poster_path
                                            alt={movie.title} // Map title
                                            sx={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div>No movies found.</div>
                        )}
                    </Slider>

                </Box>

                {/* special offers */}
                <Box>
                    <Typography variant="h4" sx={{ textAlign: 'start', m: 2, mt: 4 }} fontWeight={400}>
                        Special Offers
                    </Typography>
                    <Grid container spacing={2}>
                        {specialOffersData.map((offer, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Card sx={{ minWidth: 275, ml: 2 }}>
                                    <CardContent>
                                        {/* Flex container for icon and title */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}> {/* Aligns icon and title */}
                                            <Box sx={{ mr: 2 }}>
                                                {offer.icon}
                                            </Box>
                                            <Typography
                                                gutterBottom
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: 14,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {offer.title}
                                            </Typography>
                                        </Box>
                                        {/* Description text */}
                                        <Typography sx={{ color: 'text.secondary', textAlign: "start" }}>
                                            {offer.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default MultipleItemsSlider;
