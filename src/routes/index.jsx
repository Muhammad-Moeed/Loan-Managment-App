import Signup from '../pages/signup.jsx';
import Login from '../pages/login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import MyLoanRequest from '../pages/MyLoanRequest.jsx';
import NewLoan from '../pages/NewLoan';
import Profile from '../pages/Profile';
import ErrorPage from '../pages/ErrorPage';
import LandingPage from '../pages/LandingPage.jsx';
import PrivateRoute from '../components/PrivateRoute';

const routes = [
  {
    path: '/',
    element: <LandingPage />,
    showInSidebar: false,
    layout: false, 
  },
  {
    path: '/signup',
    element: <Signup />,
    showInSidebar: false,
    layout: false, 
  },
  {
    path: '/login',
    element: <Login />,
    showInSidebar: false,
    layout: false, 
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    showInSidebar: true,
    sidebarText: 'Dashboard',
    sidebarIcon: 'dashboard',
    layout: true,
  },
  {
    path: '/my-loan-request',
    element: (
      <PrivateRoute>
        <MyLoanRequest />
      </PrivateRoute>
    ),
    showInSidebar: true,
    sidebarText: 'My Loan Request',
    sidebarIcon: 'request',
    layout: true,
  },
  {
    path: '/new-loan',
    element: (
      <PrivateRoute>
        <NewLoan />
      </PrivateRoute>
    ),
    showInSidebar: true,
    sidebarText: 'New Loan',
    sidebarIcon: 'loan',
    layout: true,
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
    showInSidebar: true,
    sidebarText: 'Profile',
    sidebarIcon: 'profile',
    layout: true,
  },
  {
    path: '*',
    element: <ErrorPage />,
    showInSidebar: false,
    layout: false
  }
];

export default routes;
