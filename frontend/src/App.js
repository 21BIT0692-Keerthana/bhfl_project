import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';

function App() {
    const [inputData, setInputData] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let parsedData;
            try {
                parsedData = JSON.parse(inputData);
            } catch (error) {
                return alert("Invalid JSON format. Please check your input.");
            }

            if (!parsedData.data || !Array.isArray(parsedData.data)) {
                return alert("Invalid input. 'data' field should be an array.");
            }

            const res = await axios.post('http://localhost:5000/bfhl', parsedData);
            setResponse(res.data);
        } catch (error) {
            alert('Error processing request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedFilters([...selectedFilters, value]);
        } else {
            setSelectedFilters(selectedFilters.filter(f => f !== value));
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>BFHL Application</Typography>
            <Paper elevation={3} sx={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Enter JSON Data"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        sx={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
                {loading && <CircularProgress sx={{ margin: '20px auto', display: 'block' }} />}
                {response && (
                    <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="h6">Response:</Typography>
                        <FormControlLabel
                            control={<Checkbox value="Numbers" onChange={handleFilterChange} />}
                            label="Numbers"
                        />
                        <FormControlLabel
                            control={<Checkbox value="Alphabets" onChange={handleFilterChange} />}
                            label="Alphabets"
                        />
                        <FormControlLabel
                            control={<Checkbox value="Highest Lowercase Alphabet" onChange={handleFilterChange} />}
                            label="Highest Lowercase Alphabet"
                        />
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            {selectedFilters.includes("Numbers") && (
                                <Grid item xs={12}>
                                    <Paper sx={{ padding: '10px' }}>Numbers: {response.numbers.join(', ')}</Paper>
                                </Grid>
                            )}
                            {selectedFilters.includes("Alphabets") && (
                                <Grid item xs={12}>
                                    <Paper sx={{ padding: '10px' }}>Alphabets: {response.alphabets.join(', ')}</Paper>
                                </Grid>
                            )}
                            {selectedFilters.includes("Highest Lowercase Alphabet") && (
                                <Grid item xs={12}>
                                    <Paper sx={{ padding: '10px' }}>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join(', ')}</Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default App;
