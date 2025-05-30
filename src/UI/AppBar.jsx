import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { MdVerified } from 'react-icons/md';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
  <MdVerified />
  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    <Button variant="text" size="small" sx={{ color: 'black' }}>Features</Button>
    <Button variant="text" size="small" sx={{ color: 'black' }}>Testimonials</Button>
    <Button variant="text" size="small" sx={{ color: 'black' }}>Highlights</Button>
    <Button variant="text" size="small" sx={{ minWidth: 0, color: 'black' }}>FAQ</Button>
    <Button variant="text" size="small" sx={{ minWidth: 0, color: 'black' }}>Blog</Button>
  </Box>
</Box>


          {/* Desktop Sign In/Up */}
         <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
  <Button
    variant="text"
    size="small"
    onClick={() => navigate('/login')}
    sx={{
      color: '#f3aa02',
      backgroundColor: '#000',
      '&:hover': {
        backgroundColor: '#111',
      },
    }}
  >
    Sign in
  </Button>
  <Button
    variant="contained"
    size="small"
    onClick={() => navigate('/signup')}
    sx={{
      backgroundColor: '#000',
      color: '#f3aa02',
      '&:hover': {
        backgroundColor: '#111',
      },
    }}
  >
    Sign up
  </Button>
</Box>


          {/* Mobile Menu Icon */}
          <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            anchor="top"
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: { top: 'var(--template-frame-height, 0px)' },
            }}
          >
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              <MenuItem>Features</MenuItem>
              <MenuItem>Testimonials</MenuItem>
              <MenuItem>Highlights</MenuItem>
              <MenuItem>FAQ</MenuItem>
              <MenuItem>Blog</MenuItem>
              <Divider sx={{ my: 3 }} />

              {/* Mobile Sign Up/In */}
              <MenuItem>
  <Button
    variant="contained"
    fullWidth
    onClick={() => {
      toggleDrawer(false)();
      navigate('/signup');
    }}
    sx={{
      backgroundColor: '#000',
      color: '#f3aa02',
      '&:hover': {
        backgroundColor: '#111',
      },
    }}
  >
    Sign up
  </Button>
</MenuItem>

              <MenuItem>
               <Button
  variant="outlined"
  fullWidth
  onClick={() => {
    toggleDrawer(false)();
    navigate('/login');
  }}
  sx={{
    borderColor: '#f3aa02',
    color: '#f3aa02',
    '&:hover': {
      backgroundColor: 'rgba(243, 170, 2, 0.1)',
      borderColor: '#f3aa02',
    },
  }}
>
  Sign in
</Button>

              </MenuItem>
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
