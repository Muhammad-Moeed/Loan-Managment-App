import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import routes from './routes/index.jsx';

const router = createBrowserRouter([
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