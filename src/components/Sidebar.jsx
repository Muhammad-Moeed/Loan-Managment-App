import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider, Toolbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RequestQuote as LoanRequestIcon,
  RealEstateAgent as NewLoanIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [activePath, setActivePath] = useState('');
  const location = useLocation();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const sidebarRoutes = routes.filter(route => route.showInSidebar);

  const iconMap = {
    dashboard: <DashboardIcon />,
    request: <LoanRequestIcon />,
    loan: <NewLoanIcon />,
    profile: <ProfileIcon />
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#2c2c2c',
          color: 'white',
          paddingTop: '16px',
        },
      }}
    >
      <Toolbar />
      <Divider sx={{ bgcolor: '#333' }} />
      <List>
        {sidebarRoutes.map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton
              component={Link}
              to={route.path}
              onClick={() => setActivePath(route.path)}
              sx={{
                '&:hover': {
                  color: '#ffb300',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.05)',
                },
                backgroundColor: activePath === route.path ? '#ffb300' : 'transparent',
                color: activePath === route.path ? 'black' : 'inherit',
                '& .MuiListItemIcon-root': {
                  color: activePath === route.path ? 'black' : 'inherit',
                },
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon>
                {iconMap[route.sidebarIcon]}
              </ListItemIcon>
              <ListItemText
                primary={route.sidebarText}
                sx={{
                  fontWeight: '500',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
