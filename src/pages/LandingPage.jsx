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
  Modal,
  LinearProgress,
  Tabs,
  Tab,
  Chip,
  Divider,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  styled
} from '@mui/material';
import {
  AccountBalanceWallet,
  AttachMoney,
  FlashOn,
  DirectionsCar,
  Close,
  Notifications,
  HelpOutline,
  Person,
  BarChart,
  CalendarToday,
  Receipt,
  CreditCard,
  TrendingUp,
  Security,
  Payment,
  Savings,
  Star,
  Rocket,
  Shield
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';

const BlackYellowTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd700', // Gold/Yellow
    },
    secondary: {
      main: '#000000', // Black
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 215, 0, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
          },
        },
        outlined: {
          fontWeight: 600,
          textTransform: 'none',
          borderColor: 'rgba(255, 215, 0, 0.5)',
          color: '#ffd700',
          '&:hover': {
            borderColor: '#ffd700',
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const GlowPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover:after': {
    opacity: 1,
  },
}));

const LoanDashboard = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const loanData = [
    { id: 1, name: 'Car Loan', amount: 15000, paid: 5000, rate: 7.5, term: 36, nextPayment: '2023-06-15', status: 'active' },
    { id: 2, name: 'Personal Loan', amount: 10000, paid: 3000, rate: 10.2, term: 24, nextPayment: '2023-06-20', status: 'active' },
    { id: 3, name: 'Home Renovation', amount: 15000, paid: 15000, rate: 8.0, term: 60, nextPayment: 'N/A', status: 'completed' },
  ];

  const paymentHistory = [
    { id: 1, date: '2023-05-15', amount: 450.00, loan: 'Car Loan', status: 'paid' },
    { id: 2, date: '2023-05-10', amount: 500.00, loan: 'Personal Loan', status: 'paid' },
    { id: 3, date: '2023-04-15', amount: 450.00, loan: 'Car Loan', status: 'paid' },
    { id: 4, date: '2023-04-10', amount: 500.00, loan: 'Personal Loan', status: 'paid' },
  ];

  const chartData = [
    ['Month', 'Paid', 'Due'],
    ['Jan', 1000, 400],
    ['Feb', 1170, 460],
    ['Mar', 660, 1120],
    ['Apr', 1030, 540],
    ['May', 1000, 400],
    ['Jun', 1170, 460],
  ];

  const totalLoan = loanData.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = loanData.reduce((sum, loan) => sum + loan.paid, 0);
  const totalDue = totalLoan - totalPaid;
  const progressValue = (totalPaid / totalLoan) * 100;

  return (
    <ThemeProvider theme={BlackYellowTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* App Bar - Black with Yellow Accents */}
        <Box sx={{ 
          bgcolor: 'secondary.main', 
          boxShadow: '0 2px 10px rgba(255, 215, 0, 0.2)',
          position: 'sticky', 
          top: 0, 
          zIndex: 1100,
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <Container maxWidth="xl">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              py: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2,
                  color: 'secondary.main',
                  fontWeight: 'bold'
                }}>
                  <Rocket />
                </Avatar>
                <Typography variant="h6" sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ffd700 30%, #ffffff 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px'
                }}>
                  ASAN QARZA
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton sx={{ color: 'primary.main' }}>
                  <Notifications />
                </IconButton>
                <IconButton sx={{ color: 'primary.main' }}>
                  <HelpOutline />
                </IconButton>
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  color: 'secondary.main'
                }}>
                  <Person />
                </Avatar>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar */}
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <GlowPaper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      TOTAL LOAN BALANCE
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: 'primary.main'
                    }}>
                      ${totalLoan.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={progressValue} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      mb: 2,
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main'
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Paid
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${totalPaid.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Remaining
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${totalDue.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mb: 2 }}
                    onClick={() => navigate('/new-loan')}
                    startIcon={<Star />}
                  >
                    Apply for New Loan
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate('/emi-calculator')}
                    startIcon={<BarChart />}
                  >
                    EMI Calculator
                  </Button>
                </GlowPaper>
                
                <GlowPaper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Shield fontSize="small" /> Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      startIcon={<Payment />} 
                      sx={{ 
                        justifyContent: 'flex-start',
                        color: 'primary.main'
                      }}
                      onClick={() => navigate('/make-payment')}
                    >
                      Make Payment
                    </Button>
                    <Button 
                      startIcon={<Receipt />} 
                      sx={{ 
                        justifyContent: 'flex-start',
                        color: 'primary.main'
                      }}
                      onClick={() => navigate('/statements')}
                    >
                      View Statements
                    </Button>
                    <Button 
                      startIcon={<TrendingUp />} 
                      sx={{ 
                        justifyContent: 'flex-start',
                        color: 'primary.main'
                      }}
                      onClick={() => navigate('/reports')}
                    >
                      Reports
                    </Button>
                    <Button 
                      startIcon={<CalendarToday />} 
                      sx={{ 
                        justifyContent: 'flex-start',
                        color: 'primary.main'
                      }}
                      onClick={() => navigate('/schedule')}
                    >
                      Payment Schedule
                    </Button>
                  </Box>
                </GlowPaper>
              </Grid>
            )}

            {/* Main Content Area */}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              {showNotification && (
                <GlowPaper sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'rgba(255, 215, 0, 0.1)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderColor: 'primary.main'
                }}>
                  <Typography sx={{ color: 'primary.main' }}>
                    <strong>Upcoming Payment:</strong> $450.00 for Car Loan due on June 15, 2023
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setShowNotification(false)}
                    sx={{ color: 'primary.main' }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </GlowPaper>
              )}

              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { 
                    title: 'Total Loans', 
                    value: `$${totalLoan.toLocaleString()}`, 
                    icon: <AccountBalanceWallet fontSize="large" />,
                    trend: '12% increase',
                    color: 'primary.main'
                  },
                  { 
                    title: 'Amount Paid', 
                    value: `$${totalPaid.toLocaleString()}`, 
                    icon: <AttachMoney fontSize="large" />,
                    trend: '8% increase',
                    color: 'success.main'
                  },
                  { 
                    title: 'Remaining Balance', 
                    value: `$${totalDue.toLocaleString()}`, 
                    icon: <FlashOn fontSize="large" />,
                    trend: '5% decrease',
                    color: 'warning.main'
                  },
                  { 
                    title: 'Active Loans', 
                    value: loanData.filter(l => l.status === 'active').length, 
                    icon: <DirectionsCar fontSize="large" />,
                    trend: '2 active',
                    color: 'info.main'
                  }
                ].map((card, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <GlowPaper sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      height: '100%',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: 'rgba(255, 215, 0, 0.1)', 
                          width: 50, 
                          height: 50,
                          color: card.color
                        }}>
                          {card.icon}
                        </Avatar>
                        <Chip 
                          label={card.trend} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(255, 215, 0, 0.1)',
                            color: 'primary.main'
                          }} 
                        />
                      </Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: 'primary.main'
                      }}>
                        {card.value}
                      </Typography>
                    </GlowPaper>
                  </Grid>
                ))}
              </Grid>

              {/* Chart Section */}
              <GlowPaper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TrendingUp fontSize="small" /> Payment History
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Chart
                    chartType="AreaChart"
                    loader={<div>Loading Chart</div>}
                    data={chartData}
                    options={{
                      title: 'Monthly Payment Performance',
                      hAxis: { 
                        title: 'Month', 
                        titleTextStyle: { color: '#ffd700' },
                        textStyle: { color: '#b0b0b0' },
                      },
                      vAxis: { 
                        minValue: 0,
                        textStyle: { color: '#b0b0b0' },
                        titleTextStyle: { color: '#ffd700' },
                      },
                      colors: ['#ffd700', '#1a7f64'],
                      chartArea: { width: '80%', height: '70%', backgroundColor: '#1e1e1e' },
                      legend: { 
                        position: 'top',
                        textStyle: { color: '#ffffff' }
                      },
                      backgroundColor: '#1e1e1e',
                      titleTextStyle: { color: '#ffd700' },
                    }}
                  />
                </Box>
              </GlowPaper>

              {/* Tabs Section */}
              <GlowPaper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    '& .MuiTabs-indicator': { 
                      bgcolor: 'primary.main',
                      height: 3
                    },
                    borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
                  }}
                >
                  <Tab label="Active Loans" sx={{ 
                    color: 'text.primary',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }} />
                  <Tab label="Payment History" sx={{ 
                    color: 'text.primary',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }} />
                  <Tab label="Loan Analytics" sx={{ 
                    color: 'text.primary',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }} />
                </Tabs>
                
                <Box sx={{ p: 3 }}>
                  {activeTab === 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <DirectionsCar fontSize="small" /> Your Active Loans
                      </Typography>
                      {loanData.filter(l => l.status === 'active').map(loan => (
                        <Box key={loan.id} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {loan.name}
                            </Typography>
                            <Chip 
                              label={`${loan.rate}% APR`} 
                              size="small" 
                              sx={{
                                bgcolor: 'rgba(255, 215, 0, 0.1)',
                                color: 'primary.main'
                              }}
                            />
                          </Box>
                          
                          <LinearProgress 
                            variant="determinate" 
                            value={(loan.paid / loan.amount) * 100} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4, 
                              mb: 1,
                              backgroundColor: 'rgba(255, 215, 0, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'primary.main'
                              }
                            }} 
                          />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              ${loan.paid.toLocaleString()} paid of ${loan.amount.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {loan.term - Math.floor((loan.paid / loan.amount) * loan.term)} months remaining
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Next Payment:</strong> {loan.nextPayment}
                            </Typography>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => navigate(`/loan-details/${loan.id}`)}
                            >
                              View Details
                            </Button>
                          </Box>
                          <Divider sx={{ mt: 2, borderColor: 'rgba(255, 215, 0, 0.1)' }} />
                        </Box>
                      ))}
                      
                      <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/new-loan')}
                        startIcon={<Star />}
                      >
                        Apply for New Loan
                      </Button>
                    </Box>
                  )}
                  
                  {activeTab === 1 && (
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Receipt fontSize="small" /> Payment History
                      </Typography>
                      {paymentHistory.map(payment => (
                        <Box key={payment.id} sx={{ 
                          mb: 2, 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 215, 0, 0.05)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 215, 0, 0.1)'
                          }
                        }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {payment.loan}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {payment.date} • {payment.status}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            color: 'primary.main'
                          }}>
                            ${payment.amount.toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/payment-history')}
                        startIcon={<BarChart />}
                      >
                        View Full History
                      </Button>
                    </Box>
                  )}
                  
                  {activeTab === 2 && (
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <BarChart fontSize="small" /> Loan Analytics
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <GlowPaper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Loan Distribution
                            </Typography>
                            <Chart
                              chartType="PieChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['Loan', 'Amount'],
                                ['Car Loan', 15000],
                                ['Personal Loan', 10000],
                                ['Home Renovation', 15000],
                              ]}
                              options={{
                                title: '',
                                pieHole: 0.4,
                                colors: ['#ffd700', '#1a7f64', '#2ecc71'],
                                backgroundColor: '#1e1e1e',
                                legend: {
                                  textStyle: {
                                    color: '#ffffff'
                                  }
                                }
                              }}
                              width="100%"
                              height="300px"
                            />
                          </GlowPaper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <GlowPaper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Interest Rates Comparison
                            </Typography>
                            <Chart
                              chartType="BarChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['Loan', 'Your Rate', 'Market Avg'],
                                ['Car Loan', 7.5, 8.2],
                                ['Personal Loan', 10.2, 12.5],
                                ['Home Loan', 8.0, 9.1],
                              ]}
                              options={{
                                title: '',
                                chartArea: { width: '70%', backgroundColor: '#1e1e1e' },
                                colors: ['#ffd700', '#1a7f64'],
                                backgroundColor: '#1e1e1e',
                                hAxis: {
                                  title: 'Interest Rate (%)',
                                  minValue: 0,
                                  textStyle: { color: '#b0b0b0' },
                                  titleTextStyle: { color: '#ffd700' }
                                },
                                vAxis: {
                                  title: 'Loan Type',
                                  textStyle: { color: '#b0b0b0' },
                                  titleTextStyle: { color: '#ffd700' }
                                },
                                legend: {
                                  textStyle: {
                                    color: '#ffffff'
                                  }
                                }
                              }}
                              width="100%"
                              height="300px"
                            />
                          </GlowPaper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </GlowPaper>
            </Grid>
          </Grid>
        </Container>

        {/* Onboarding Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            outline: 'none',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <IconButton
              onClick={handleClose}
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10,
                color: 'primary.main'
              }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: 60, 
                height: 60, 
                mx: 'auto', 
                mb: 2,
                color: 'secondary.main'
              }}>
                <Rocket fontSize="large" />
              </Avatar>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: 'linear-gradient(45deg, #ffd700 30%, #ffffff 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome to Asan Qarza
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your premium loan management solution
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              {[
                { icon: <Security color="primary" />, text: 'Bank-grade security' },
                { icon: <BarChart color="primary" />, text: 'Advanced analytics dashboard' },
                { icon: <Payment color="primary" />, text: 'Smart payment tracking' },
              ].map((item, i) => (
                <Box key={i} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  color: 'text.primary',
                  bgcolor: 'rgba(255, 215, 0, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}>
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                mb: 2,
                fontWeight: 700
              }}
              onClick={() => {
                handleClose();
                navigate('/dashboard');
              }}
              startIcon={<TrendingUp />}
            >
              Explore Dashboard
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                handleClose();
                navigate('/tutorial');
              }}
              startIcon={<HelpOutline />}
            >
              Take a Tour
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default LoanDashboard;