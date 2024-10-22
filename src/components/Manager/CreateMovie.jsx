import React, { useState } from 'react';
import genericService from '../../rest/GenericService';

function CreateMovie() {
    // States to store form input for title and year
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        if (title && year) {
            try {
                await genericService.createMovie(title, year);
                setSuccessMessage(`Movie "${title}" created successfully!`);
            } catch (error) {
                console.error('Error creating movie:', error);
                setError(error.message || 'An error occurred while creating the movie.');
            }
        } else {
            setError('Please provide both a title and a year');
        }
    };

    return (
        <div>
            <h2>Create Movie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="year">Year:</label>
                    <input
                        id="year"
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Movie</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default CreateMovie;
