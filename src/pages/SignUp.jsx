import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Container, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import Logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../services/supabaseClient';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Get the current session
      if (session) {
        navigate('/dashboard'); // Redirect to dashboard if user is logged in
      }
    };
    
    checkSession();
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const checkIfEmailExists = async (email) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'incorrect_password_123',
    });

    if (error && error.message.toLowerCase().includes('invalid login credentials')) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.warn('This email is already registered. Please log in.');
          setTimeout(() => navigate('/logIn'), 3000);
        } else {
          toast.error('Error: ' + error.message);
        }
      } else {
        const userId = data?.user?.id;
        if (userId) {
          localStorage.setItem('userId', userId);
        }
  
        toast.success('Sign-up successful! Check your email for verification.');
        setTimeout(() => navigate('/logIn'), 3000);
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };
  

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000000, #1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', px: 2 }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <Container maxWidth="sm" disableGutters>
        <Paper elevation={10} sx={{ p: 4, background: '#111', borderRadius: 3, boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)', border: '1px solid #FFD700', color: '#fff' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img src={Logo} alt="Logo" style={{ width: 70 }} />
            <Typography variant="h5" sx={{ color: '#FFD700', mt: 2, fontWeight: 'bold' }}>
              Create Account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField name="email" label="Email" fullWidth margin="normal" variant="filled" value={formData.email} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#FFD700' }} /></InputAdornment>), sx: { bgcolor: '#1a1a1a', color: '#fff' } }} InputLabelProps={{ sx: { color: '#FFD700' } }} />

            <TextField name="password" label="Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" variant="filled" value={formData.password} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: '#FFD700' }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility}>{showPassword ? <Visibility sx={{ color: '#FFD700' }} /> : <VisibilityOff sx={{ color: '#FFD700' }} />}</IconButton></InputAdornment>), sx: { bgcolor: '#1a1a1a', color: '#fff' } }} InputLabelProps={{ sx: { color: '#FFD700' } }} />

            <TextField name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" variant="filled" value={formData.confirmPassword} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: '#FFD700' }} /></InputAdornment>), sx: { bgcolor: '#1a1a1a', color: '#fff' } }} InputLabelProps={{ sx: { color: '#FFD700' } }} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, bgcolor: '#FFD700', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#e6c200' } }}>
              Sign Up
            </Button>
          </form>

          <Typography sx={{ mt: 2, color: '#ccc', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: '#FFD700', textDecoration: 'none' }}>Login</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
