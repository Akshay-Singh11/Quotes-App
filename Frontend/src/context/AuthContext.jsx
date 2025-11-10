import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const api = axios.create({ baseURL: 'http://localhost:8080' });

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      api
        .get('/me', { headers: { Authorization: `Bearer ${t}` } })
        .then((res) => {
          setUser(res.data);
          setFavorites(res.data.favorites || []);
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setFavorites(data.user.favorites || []);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setFavorites(data.user.favorites || []);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('token');
  };

  const isFavorite = (id) => favorites.some((q) => q._id === id);

  const toggleFavorite = async (id) => {
    if (!token) throw new Error('Login required');
    const headers = { Authorization: `Bearer ${token}` };
    if (isFavorite(id)) {
      const { data } = await api.delete(`/quotes/${id}/favorite`, { headers });
      setFavorites(data);
    } else {
      const { data } = await api.post(`/quotes/${id}/favorite`, {}, { headers });
      setFavorites(data);
    }
  };

  const value = useMemo(
    () => ({ token, user, favorites, login, register, logout, isFavorite, toggleFavorite }),
    [token, user, favorites]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

