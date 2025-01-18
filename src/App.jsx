import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NavigationBar } from './components/NavigationBar';
import { useCheckAuth } from './hooks/useCheckAuth';

export const App = () => {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Avoid rendering anything until navigation completes
  }

  return (
    <>
      <NavigationBar />
      <div className="p-14">
        <Outlet />
      </div>
    </>
  );
};
