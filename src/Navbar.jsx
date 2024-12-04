import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { Divider } from '@mui/material';

const pages = ['Home', 'My Tickets'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, logout } = useAuth(); // Use authentication context
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="transparent" sx={{ boxShadow: '0' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LiveTvIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#000',
                textDecoration: 'none',
              }}
            >
              Movie TIX
            </Typography>

            {/* Mobile view menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {user ? (
                  pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        component={Link}
                        to={page === 'Home' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`}
                        sx={{ color: '#000' }}
                      >
                        {page}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        component={Link}
                        to="/login"
                        sx={{ color: '#000' }}
                      >
                        Sign In
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        component={Link}
                        to="/signup"
                        sx={{ color: '#000' }}
                      >
                        Sign Up
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            <LiveTvIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#000',
                textDecoration: 'none',
              }}
            >
              Movie TIX
            </Typography>

            {/* Desktop menu items */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
              {user ? (
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page === 'Home' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`}
                    sx={{ my: 2, color: '#000', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    component={Link}
                    variant='contained'
                    to="/login"
                    sx={{ my: 2, color: '#000', display: 'block', textTransform: 'none' }}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleCloseNavMenu}
                    component={Link}
                    variant='contained'
                    to="/register"
                    sx={{ my: 2, color: '#000', display: 'block', textTransform: 'none' }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* User Avatar and Menu */}
            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name || 'defaultName'}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{user?.firstName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Divider />
    </>
  );
}

export default Navbar;
