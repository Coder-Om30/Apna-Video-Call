import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme();

export default function Authentication() {
    // Initialize state with empty strings instead of undefined
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        try {
            // Clear previous errors
            setError('');
            
            if (formState === 0) {
                // Login
                const result = await handleLogin(username, password);
                console.log(result);
            }
            
            if (formState === 1) {
                // Register
                const result = await handleRegister(name, username, password);
                console.log(result);
                
                // Clear form and show success message
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result);
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            console.error('Authentication error:', err);
            
            // Better error handling
            let errorMessage = 'An error occurred. Please try again.';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        handleAuth();
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setOpen(false);
        setMessage('');
    };

    // Form validation
    const isFormValid = () => {
        if (formState === 0) {
            // Login validation
            return username.trim() !== '' && password.trim() !== '';
        } else {
            // Register validation
            return name.trim() !== '' && username.trim() !== '' && password.trim() !== '';
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/public/background.png")', // Fixed path
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        {/* Form toggle buttons */}
                        <Box sx={{ mb: 2 }}>
                            <Button 
                                variant={formState === 0 ? "contained" : "outlined"} 
                                onClick={() => { 
                                    setFormState(0);
                                    setError('');
                                }}
                                sx={{ mr: 1 }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant={formState === 1 ? "contained" : "outlined"} 
                                onClick={() => { 
                                    setFormState(1);
                                    setError('');
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoComplete="username"
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && (
                                <Box sx={{ mt: 2 }}>
                                    <p style={{ color: 'red', margin: 0 }}>{error}</p>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={!isFormValid()}
                            >
                                {formState === 0 ? "Sign In" : "Sign Up"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={message}
            />
        </ThemeProvider>
    );
}