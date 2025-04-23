import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  if (!session) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
