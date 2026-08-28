import React, { createContext, useState, useContext, useEffect } from 'react';
import { dbService } from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage from previous session
    const storedUser = localStorage.getItem('herzberg_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await dbService.login(email, password);
      setUser(loggedUser);
      localStorage.setItem('herzberg_user', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('herzberg_user');
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('herzberg_user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
