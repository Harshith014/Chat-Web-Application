import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import Allusers from './components/Allusers';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import { ColorModeContext, ThemeContextProvider } from './context/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAppClick = () => {
    navigate('/chat');
  };



  // Hide header on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <Box className="p-4" sx={{ backgroundColor: '#333', color: '#fff', border: '2px solid #444' }}>
      {/* Set fixed dark background, white font color, and outline */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5" component="h2" sx={{ cursor: 'pointer' }} onClick={handleAppClick}>
            Chat App
          </Typography>
        </Grid>
        <Grid item>
          <Box>
            <Tooltip title="Toggle light/dark theme">
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {colorMode.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile">
              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircle />
              </IconButton>
            </Tooltip>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/allusers" element={<Allusers />} />
            <Route path="/profile" element={<UserProfile />} />

          </Routes>
        </div>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
