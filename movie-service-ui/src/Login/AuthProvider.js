import React, { createContext, useState, useContext } from 'react';
import { login as loginApi } from '../services/service';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setLoading(true);
    try {
      const userData = await loginApi(data);
      console.log(userData);
      Cookies.set('token', userData.token, { expires: 7 });
      setUser(userData);
      return userData; // Return the userData here
    } catch (error) {
      console.error('Login failed:>', error);
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('token'); // Clear the token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
