import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Button,
  Modal
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';

const LoanDashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ bgcolor: '#327765', minHeight: '100vh', py: 4 }}>
      {/* Header */}
      <Box sx={{ position: 'sticky', top: 0, bgcolor: '#F0FFF4', zIndex: 1000, py: 2, mb: 4 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#226754' }}>
            Loan Dashboard
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#FFD700', color: '#226754', fontWeight: 'bold', '&:hover': { bgcolor: '#FFB300' } }}
            onClick={() => setOpen(true)}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Summary Cards */}
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          {[
            { title: 'Total Loan', value: '$40,000', icon: <AccountBalanceWalletIcon /> },
            { title: 'Paid Loan', value: '$25,000', icon: <AttachMoneyIcon /> },
            { title: 'Due Loan', value: '$15,000', icon: <FlashOnIcon /> },
            { title: 'Active EMI', value: '$360.32', icon: <DirectionsCarIcon /> }
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper elevation={8} sx={{ bgcolor: '#fff', p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#FFD700', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                  {card.icon}
                </Avatar>
                <Typography variant="subtitle1" color="#888">
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Additional Loan Information Section */}
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: '#f4fdf7', mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#226754', mb: 2 }}>
            Loan Management Made Easy
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            With Asan Qarza, keep track of all your loan details including active EMIs, payment schedules, and total amount due.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Our platform ensures transparency, quick updates, and detailed insights so you can manage your finances effortlessly.
          </Typography>
          <Typography variant="body1">
            Stay ahead of due dates, calculate EMIs using our built-in tool, and explore options for refinancing or loan extensions directly from your dashboard.
          </Typography>
        </Paper>

        {/* Welcome Section */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#226754' }}>
            Welcome to Asan Qarza
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            A loan management system that helps you keep everything under control.
          </Typography>
          <Typography variant="body1">
            Track your loans, monitor EMI schedules, and gain financial clarity.
          </Typography>
        </Paper>

        {/* Feature Cards Section */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#fff' }}>
          Our Key Features
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ flexWrap: 'nowrap', overflowX: 'auto', mb: 6 }}>
          {[
            {
              icon: <FlashOnIcon sx={{ fontSize: 40 }} />, title: 'Quick Access', desc: 'Access all loan data instantly and securely from one place.'
            },
            {
              icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />, title: 'EMI Calculator', desc: 'Plan your payments easily with built-in EMI tools.'
            },
            {
              icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />, title: 'Loan Summary', desc: 'See a clear overview of total, paid and due loans.'
            }
          ].map((item, i) => (
            <Grid item xs={10} sm={6} md={4} key={i} sx={{ flex: '0 0 auto' }}>
              <Paper elevation={6} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Avatar sx={{ bgcolor: '#FFD700', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Illustration Image */}
        <Paper elevation={4} sx={{ p: 2, borderRadius: 3, mb: 6 }}>
          <img
            src="/images/loan_illustration.png"
            alt="Loan Illustration"
            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '400px' }}
          />
        </Paper>

        {/* Help Section */}
        <Box sx={{ bgcolor: '#F9F9F9', py: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Need Help?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reach out to our support team for assistance or questions about your loans.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/contact')}>
            Contact Support
          </Button>
        </Box>
      </Container>

      {/* On-Load Popup */}
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          elevation={24}
          sx={{ position: 'relative', width: 400, bgcolor: '#fff', p: 4, borderRadius: 3 }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10, color: '#226754' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#226754', mb: 2 }}>
            Welcome to Asan Qarza
          </Typography>
          <Typography variant="body1" sx={{ color: '#333', mb: 3 }}>
            This dashboard lets you manage your loans effortlessly. View summaries, track activity, calculate EMIs, and monitor statistics all in one place.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ color: '#226754', borderColor: '#226754', '&:hover': { borderColor: '#1d5f49', backgroundColor: '#f0fdf4' } }}
                onClick={() => {
                  handleClose();
                  navigate('/login');
                }}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#226754', color: '#fff', '&:hover': { bgcolor: '#1d5f49' } }}
                onClick={() => {
                  handleClose();
                  navigate('/signup');
                }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Box>
  );
};

export default LoanDashboard;
