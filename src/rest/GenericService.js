
const OMDB_API_URL = 'https://www.omdbapi.com';
const API_URL = 'http://localhost:8080';
const API_KEY = 'd2f679ea';

const genericService = {
    // Method to get movie details based on title and year
    getMovie: async (title, year) => {
        const params = new URLSearchParams({
            apikey: API_KEY,
            ...(title && { t: title }), // Include title if provided
            ...(year && { y: year }),   // Include year if provided
        });

        const url = `${OMDB_API_URL}?${params.toString()}`; // Construct the full URL

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    // Method to get all movies from the API
    getMovies: async () => {
        const url = `${API_URL}/api/movies`;  // Make sure API_URL is valid and doesn't have '+/'
        console.log(url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Log the status in case of failure
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse and return the response data
            return await response.json();
        } catch (error) {
            // Log the error
            console.error('Error fetching movie data:', error);
            // Re-throw the error to be handled by the calling code
            throw error;
        }
    },   

    getTheaters: async () => {
        const url = `${API_URL}/api/theaters`;  // Make sure API_URL is valid and doesn't have '+/'
        console.log(url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Log the status in case of failure
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse and return the response data
            return await response.json();
        } catch (error) {
            // Log the error
            console.error('Error fetching Theater data:', error);
            // Re-throw the error to be handled by the calling code
            throw error;
        }
    },   

    createMovie: async (movieData) => {
        // Map the OMDb fields to your backend model
        const mappedMovieData = {
            title: movieData.Title,
            description: movieData.Plot,  // Use "Plot" from OMDb as "description"
            poster: movieData.Poster,
            duration: parseInt(movieData.Runtime), // Convert "Runtime" from "XX min" to an integer
            genre: movieData.Genre,
            releaseDate: new Date(movieData.Released).toISOString().split('T')[0],  // Format release date as YYYY-MM-DD
            rating: parseFloat(movieData.imdbRating), // Convert IMDb rating to a decimal
        };    
        const postUrl = `${API_URL}/api/movies`;  // Local API endpoint to post the movie data
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mappedMovieData), // Send the mapped movie data
        };
    
        try {
            const postResponse = await fetch(postUrl, postOptions);
            if (!postResponse.ok) {
                throw new Error(`HTTP error! Status: ${postResponse.status}`);
            }
            return await postResponse.json();
        } catch (error) {
            console.error('Error creating movie data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    }       
};

export default genericService;
