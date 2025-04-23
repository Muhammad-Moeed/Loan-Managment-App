import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar.jsx';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient.js';

const Layout = ({ children, layout = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Logout failed. Please try again.');
      }
      else {
        toast.success('Logged out successfully!');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error('An error occurred during logout. Please try again.');
    }
  }


  return (
    <Box sx={{ display: 'flex', width: '100%', margin: 0 }}>
      {/* Conditionally render Sidebar based on layout prop */}
      {layout && <Sidebar />}

      <Box component="main" sx={{ flexGrow: 1, margin: 0, padding: 0 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#1e1e2f',
            boxShadow: 'none',
            margin: 0, // Ensure no margin on AppBar
            padding: 0, // Ensure no padding on AppBar
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', margin: 0, padding: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="Asan Qarza Logo"
                sx={{ height: 50, display: { xs: 'none', sm: 'block' } }}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  fontWeight: 'bold',
                  color: '#ffb300',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                Asan Qarza
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, maxWidth: 600, mx: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: alpha('#ffffff', 0.1),
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                  width: '100%',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2)
                  }
                }}
              >
                <SearchIcon sx={{ mr: 1, color: '#ffb300' }} />
                <InputBase
                  placeholder="Search..."
                  fullWidth
                  sx={{ color: 'white' }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                onClick={handleLogout}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffb300',
                  color: '#1e1e2f',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#ff6f00'
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography fontWeight="500">Logout</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            mt: 8, // Top margin adjusted for AppBar height
            px: layout ? 3 : 0, // If layout=true, apply padding, else no padding
            py: layout ? 3 : 0, // If layout=true, apply padding, else no padding
            backgroundColor: '#f4f6f9',
            color: '#ffffff',
            minHeight: '100vh',
            margin: 0, // Remove margin for the container Box
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
