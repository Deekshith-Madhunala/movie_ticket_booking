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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error;
        }
    },

    getTheaters: async () => {
        const url = `${API_URL}/api/theaters`;  // Make sure API_URL is valid and doesn't have '+/'
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching Theater data:', error);
            throw error;
        }
    },

    createMovie: async (title, year) => {
        try {
            // Call getMovie to fetch movie data from OMDb
            const movieData = await genericService.getMovie(title, year); // Wait for the movie data
            console.log('Fetched Movie Data:', movieData);
    
            // Check if movieData is valid (ensure the movie exists in OMDb)
            if (!movieData || movieData.Response === 'False') {
                throw new Error(`Movie not found: ${movieData.Error || 'Unknown error'}`);
            }
    
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
    
            // Post the movie data to the backend
            const postResponse = await fetch(postUrl, postOptions);
            if (!postResponse.ok) {
                throw new Error(`HTTP error! Status: ${postResponse.status}`);
            }
    
            return await postResponse.json(); // Return the created movie data
        } catch (error) {
            console.error('Error creating movie data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },
    
    createBooking: async (bookingData) => {
        const postUrl = `${API_URL}/api/bookings`;  // Local API endpoint to post the booking data
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData), // Send the booking data
        };
        try {
            const postResponse = await fetch(postUrl, postOptions);
            if (!postResponse.ok) {
                throw new Error(`HTTP error! Status: ${postResponse.status}`);
            }
            return await postResponse.json();
        } catch (error) {
            console.error('Error creating booking data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    createShowTimes: async (showTimesData) => {
        const postUrl = `${API_URL}/api/showtimes`;  // Local API endpoint to post the showtimes data
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(showTimesData), // Send the showtimes data
        };
        try {
            const postResponse = await fetch(postUrl, postOptions);
            if (!postResponse.ok) {
                throw new Error(`HTTP error! Status: ${postResponse.status}`);
            }
            return await postResponse.json();
        } catch (error) {
            console.error('Error creating showtimes data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    getAllShowTimes: async () => {
        const url = `${API_URL}/api/showtimes`;  // Make sure API_URL is valid and doesn't have '+/'
        console.log(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching showtimes data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    // New method to get bookings by user ID
    getBookingsByUserId: async (userId) => {
        const url = `${API_URL}/api/bookings/user/${userId}`; // Construct the API URL with user ID
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json(); // Parse and return the response data
        } catch (error) {
            console.error('Error fetching bookings data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    getAllBookings: async () => {
        const url = `${API_URL}/api/bookings`;  // Make sure API_URL is valid and doesn't have '+/'
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    cancelBooking: async (bookingId) => {
        const url = `${API_URL}/api/bookings/${bookingId}`; // Construct the API URL with booking ID
        const deleteOptions = {
            method: 'DELETE',
        };   
        try {
            const deleteResponse = await fetch(url, deleteOptions);
            
            // Check if the response status is OK
            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text(); // Get the error message
                throw new Error(`HTTP error! Status: ${deleteResponse.status} - ${errorText}`);
            }
    
            // If no response body is returned, just return an empty object
            return {}; // Return an empty object or any success message you prefer
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },
    
    getTimeSlots: async () => {
        
        const url = `${API_URL}/api/timeSlots`;  // Make sure API_URL is valid and doesn't have '+/'

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching time slots data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },
    getShowShedulesByDate: async (date) => {
        const url = `${API_URL}/api/showtimes/date/showtimes?showDate=${date}`;  // Construct the API URL with the showDate query parameter

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching showtime data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },

    getTimeSlotsByShowtime: async (showtimeId) => {
        const url = `${API_URL}/api/showtimes/${showtimeId}/timeSlots`;  // Adjusted to use 'timeSlots' and correct path
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching time slots data:', error);
            throw error; // Re-throw the error for handling in the calling code
        }
    },
    
    
};

export default genericService;
