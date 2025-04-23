import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import PeopleIcon from '@mui/icons-material/People';
import AddCardIcon from '@mui/icons-material/AddCard';
import { motion } from 'framer-motion'

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#111', color: '#fff', minHeight: '100vh', py: 6, px: 0 }}>
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box textAlign="center" mb={5}>
          <img src={logo} alt="Logo" style={{ width: 80 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFD700', mt: 2 }}>
            Welcome to Asan Qarza
          </Typography>
          <Typography variant="h6" sx={{ color: '#ccc', mt: 2 }}>
            Get instant loans with minimal paperwork and 100% digital process.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: '#FFD700',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e6c200' },
              borderRadius: '20px', // Rounded corners for better style
              padding: '12px 36px',
            }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Section - 4 Boxes with Animation */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Fast Approval</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Get your loan approved in just a few minutes.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <VerifiedIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Secure & Trusted</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>100% secure process, backed by trusted systems.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Flexible Options</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Choose loan amount and duration that suits you.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <AddCardIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Easy Documentation</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Complete the process with minimal paperwork.</Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* VIP Section */}
        <Box sx={{ bgcolor: '#333', mt: 6, p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700', textAlign: 'center' }}>
            VIP Loan Plans
          </Typography>
          <Typography sx={{ color: '#aaa', mt: 2, textAlign: 'center' }}>
            Exclusive plans for VIP members offering priority approval and higher loan amounts.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: '#FFD700',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e6c200' },
              borderRadius: '20px',
              padding: '12px 36px',
            }}
            onClick={() => navigate('/signup')}
          >
            Become a VIP
          </Button>
        </Box>

        {/* Why Choose Us Section */}
        <Box textAlign="center" mt={6}>
          <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Why Choose QuickLoan?
          </Typography>
          <Typography sx={{ color: '#ccc', mt: 2 }}>
            Over 100,000 satisfied customers trust us for their quick loan needs.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Large Customer Base</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Join our large community of satisfied customers.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <VerifiedIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Trusted by Partners</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Our system is trusted by top financial partners.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#222', textAlign: 'center', borderRadius: 3 }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>Instant Disbursal</Typography>
                <Typography sx={{ color: '#aaa', mt: 1 }}>Your loan amount disbursed instantly to your account.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Footer Section */}
        <Box textAlign="center" mt={6}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            &copy; {new Date().getFullYear()} QuickLoan. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
