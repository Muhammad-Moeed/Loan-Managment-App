import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import routes from './routes/index.jsx';
import Signup from './pages/signup.jsx';
import Login from './pages/login.jsx';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />  
  },
  {
    path: '/',
    element: <App />,
    children: routes.map(route => ({
      path: route.path,
      element: route.element,
      errorElement: route.path === '*' ? route.element : null
    }))
  }
]);

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
