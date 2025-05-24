// AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabaseClient';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Grid,
  Card,
  Divider,
  Avatar
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  MoreVert,
  Visibility,
  Refresh,
  Search,
  FilterList,
  AttachMoney,
  ThumbUp,
  ThumbDown,
  ListAlt
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Custom theme colors
const themeColors = {
  primary: '#000000',
  secondary: '#FFD700',
  background: '#f5f5f5', // Light background for better contrast
  paper: '#FFFFFF',
  text: '#000000',
  border: '#e0e0e0'
};

// Custom styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fafafa',
  },
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const statusConfig = {
  pending: { color: 'warning', icon: <MoreVert sx={{ color: '#FFD700' }} /> },
  approved: { color: 'success', icon: <CheckCircle sx={{ color: '#4CAF50' }} /> },
  rejected: { color: 'error', icon: <Cancel sx={{ color: '#F44336' }} /> }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Calculate statistics from Supabase data
  const stats = {
    total: requests.length,
    approved: requests.filter(req => req.status === 'approved').length,
    rejected: requests.filter(req => req.status === 'rejected').length,
    pending: requests.filter(req => req.status === 'pending').length,
    totalApprovedAmount: requests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + (parseFloat(req.loan_amount) || 0), 0)
  };

  const fetchLoanRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('loan-form-request')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (searchTerm) query = query.ilike('full_name', `%${searchTerm}%`);

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('loan-form-request')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
      showSnackbar(`Status updated to ${newStatus}`, 'success');
      fetchLoanRequests(); // Refresh stats
    } catch (err) {
      console.error('Error:', err.message);
      showSnackbar(`Update failed: ${err.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleViewDetails = (id) => {
    if (!id) {
      showSnackbar('Invalid loan ID', 'error');
      return;
    }
    navigate(`/admin/loan-detail/${id}`);
  };

  useEffect(() => {
    fetchLoanRequests();
  }, [statusFilter, searchTerm]);

  const filteredRequests = requests.filter(req => 
    req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.loan_amount?.toString().includes(searchTerm) ||
    req.id?.toString().includes(searchTerm)
  );

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: themeColors.background,
      minHeight: '100vh',
      color: themeColors.text,
      margin: 0 // Remove default margins
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        padding: 0 // Remove padding
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', backgroundColor: 'black', padding: 2, borderRadius: 2 }}>
          <span style={{ color: themeColors.secondary }}>Admin</span> Management Dashboard
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: themeColors.secondary,
            color: themeColors.primary,
            '&:hover': {
              backgroundColor: '#FFC000',
            },
            borderRadius: 2,
            padding: '8px 16px'
          }}
          startIcon={<Refresh />}
          onClick={fetchLoanRequests}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards - Now with proper PKR display */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            p: 2,
            backgroundColor: themeColors.paper,
            borderLeft: `4px solid ${themeColors.secondary}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#f5f5f5', 
                mr: 2,
                color: themeColors.secondary
              }}>
                <ListAlt />
              </Avatar>
              <Box>
                <Typography variant="body2" color="textSecondary">Total Loans</Typography>
                <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            p: 2,
            backgroundColor: themeColors.paper,
            borderLeft: '4px solid #4CAF50',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#f5f5f5', 
                mr: 2,
                color: '#4CAF50'
              }}>
                <ThumbUp />
              </Avatar>
              <Box>
                <Typography variant="body2" color="textSecondary">Approved</Typography>
                <Typography variant="h5" fontWeight="bold">{stats.approved}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            p: 2,
            backgroundColor: themeColors.paper,
            borderLeft: '4px solid #F44336',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#f5f5f5', 
                mr: 2,
                color: '#F44336'
              }}>
                <ThumbDown />
              </Avatar>
              <Box>
                <Typography variant="body2" color="textSecondary">Rejected</Typography>
                <Typography variant="h5" fontWeight="bold">{stats.rejected}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            p: 2,
            backgroundColor: themeColors.paper,
            borderLeft: '4px solid #2196F3',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#f5f5f5', 
                mr: 2,
                color: '#2196F3'
              }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography variant="body2" color="textSecondary">Approved Amount</Typography>
                <Typography variant="h5" fontWeight="bold">
                  PKR {stats.totalApprovedAmount.toLocaleString('en-PK')}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Paper sx={{ 
        p: 2, 
        mb: 3,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        backgroundColor: themeColors.paper,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <TextField
          variant="outlined"
          placeholder="Search loans..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: themeColors.secondary }} />
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: themeColors.border
              }
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: themeColors.border
              }
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Main Content */}
      {loading && !requests.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: themeColors.secondary }} />
        </Box>
      ) : error ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: themeColors.paper,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography color="error" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography sx={{ mb: 2 }}>{error}</Typography>
          <Button 
            variant="outlined" 
            onClick={fetchLoanRequests}
            sx={{ 
              color: themeColors.secondary, 
              borderColor: themeColors.secondary 
            }}
          >
            Retry
          </Button>
        </Paper>
      ) : requests.length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: themeColors.paper,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6">
            No loan requests found
          </Typography>
          <Typography color="textSecondary">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} requests available` 
              : 'No requests have been submitted yet'}
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 2, 
              backgroundColor: themeColors.paper,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: themeColors.primary }}>
                <TableRow>
                  <TableCell sx={{ color: themeColors.secondary }}>ID</TableCell>
                  <TableCell sx={{ color: themeColors.secondary }}>Applicant</TableCell>
                  <TableCell sx={{ color: themeColors.secondary }}>Amount (PKR)</TableCell>
                  <TableCell sx={{ color: themeColors.secondary }}>Status</TableCell>
                  <TableCell sx={{ color: themeColors.secondary }}>Date</TableCell>
                  <TableCell sx={{ color: themeColors.secondary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.map((req) => (
                  <StyledTableRow key={req.id}>
                    <TableCell>#{req.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {req.full_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {req.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      PKR {parseFloat(req.loan_amount || 0).toLocaleString('en-PK')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status}
                        color={statusConfig[req.status]?.color || 'default'}
                        icon={statusConfig[req.status]?.icon}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {dayjs(req.created_at).format('DD MMM, YYYY')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            sx={{ color: themeColors.primary }}
                            onClick={() => handleViewDetails(req.id)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        {req.status !== 'approved' && (
                          <Tooltip title="Approve">
                            <IconButton
                              sx={{ color: '#4CAF50' }}
                              onClick={() => updateStatus(req.id, 'approved')}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}

                        {req.status !== 'rejected' && (
                          <Tooltip title="Reject">
                            <IconButton
                              sx={{ color: '#F44336' }}
                              onClick={() => updateStatus(req.id, 'rejected')}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredRequests.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: themeColors.text
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  backgroundColor: themeColors.secondary,
                  color: themeColors.primary
                }
              }}
            />
          </Box>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}