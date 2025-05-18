import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import { AuthContext } from '../context/AuthContext';

const CompleteProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || ''
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: 'https://rskkjvdnuxymangrbwbz.supabase.co/storage/v1/object/public/avatars//avatar.png'
      })

      if (error) {
        console.error('Supabase error', error);
        toast.error(`Profile save failed: ${error.message}`);
        return;
      }

      toast.success('Profile completed!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Unexpected error', err);
      toast.error('Unexpected error: ' + err.message);
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#1a1a1a', color: '#fff' }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#FFD700' }}>Complete Your Profile</Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              name="first_name"
              label="First Name"
              fullWidth
              margin="normal"
              value={profile.first_name}
              onChange={handleChange}
              sx={{ input: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#FFD700' } }}
              required
            />
            <TextField
              name="last_name"
              label="Last Name"
              fullWidth
              margin="normal"
              value={profile.last_name}
              onChange={handleChange}
              sx={{ input: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#FFD700' } }}
              required
            />

            <Button type="submit" fullWidth sx={{ mt: 3, bgcolor: '#FFD700', color: '#000', fontWeight: 'bold' }}>
              Save Profile
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompleteProfile;
