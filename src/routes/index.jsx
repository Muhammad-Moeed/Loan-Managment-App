import Dashboard from '../pages/Dashboard.jsx';
import MyLoanRequest from '../pages/MyLoanRequest.jsx';
import NewLoan from '../pages/NewLoan';
import Profile from '../pages/Profile';
import ErrorPage from '../pages/ErrorPage';

const routes = [
  {
    path: '/',
    element: <Dashboard />,
    showInSidebar: true,
    sidebarText: 'Dashboard',
    sidebarIcon: 'dashboard'
  },
  {
    path: '/my-loan-request',
    element: <MyLoanRequest />,
    showInSidebar: true,
    sidebarText: 'My Loan Request',
    sidebarIcon: 'request'
  },
  {
    path: '/new-loan',
    element: <NewLoan />,
    showInSidebar: true,
    sidebarText: 'New Loan',
    sidebarIcon: 'loan'
  },
  {
    path: '/profile',
    element: <Profile />,
    showInSidebar: true,
    sidebarText: 'Profile',
    sidebarIcon: 'profile'
  },
  {
    path: '*',
    element: <ErrorPage />,
    showInSidebar: false
  }
];

export default routes;