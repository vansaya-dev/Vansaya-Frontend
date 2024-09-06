"use client";
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Fahkwang } from 'next/font/google';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Stack, Menu, MenuItem, Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from "next/navigation";
import { pages } from '../../routes';
import Cookies from 'js-cookie';
import { AccountCircle, Logout } from '@mui/icons-material';

const fahkwang = Fahkwang({ subsets: ['latin'], weight: ['400'] });

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    const tokenFromCookies = Cookies.get('token');
    setToken(tokenFromCookies);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('loggedInUserDetails');
    setToken(null);
    router.push('/');
    setAnchorEl(null);
  };

  const handleLogin = () => {
    router.push('/login');
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/account');
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1f2937" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop view */}
          <Box sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {!token ?
              <Button onClick={handleLogin} startIcon={<LoginIcon />} sx={{ color: 'white', fontFamily: "Futura Medium" }}>
                Login
              </Button>
              :

              < IconButton
                size="large"
                color="inherit"
                onClick={handleMenuClick} // Opens menu
              >
                <AccountCircle />
              </IconButton>
            }

            {/* Menu for account options */}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
            >
              {token ? (
                <>
                  <MenuItem onClick={handleProfileClick} sx={{ fontFamily: fahkwang.style.fontFamily }}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ fontFamily: fahkwang.style.fontFamily }}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLogin} sx={{ fontFamily: fahkwang.style.fontFamily }}>Login</MenuItem>
              )}
            </Menu>


            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Box sx={{ mb: 2, mt: 1 }}>
                <Typography
                  variant="h4"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    fontFamily: fahkwang.style.fontFamily,
                    letterSpacing: '.6rem',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  VANSAYA
                </Typography>
              </Box>

              <Stack direction="row" spacing={6} justifyContent="center">
                {pages.map((page) => page.isMenu && (
                  <Button
                    key={page.name}
                    onClick={() => { router.push(page.route); }}
                    sx={{
                      color: 'white',
                      fontFamily: "Futura Medium"
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Stack>
            </Box>

            {token &&
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="large" color="inherit" onClick={() => router.push('/cart')}>
                  <ShoppingCartIcon />
                </IconButton>

              </Box>
            }
          </Box>



          {/* mobile view */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                bgcolor: '#1f2937',
                color: 'white',
              }
            }}
          >
            <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
              <List sx={{ mt: 3 }}>
                {pages.map((page) => page.isMenu && (
                  <ListItem key={page.name} >
                    <ListItemButton onClick={() => { router.push(page.route); }}>
                      <Typography sx={{ fontFamily: "Futura Medium", }} >{page.name}</Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: fahkwang.style.fontFamily,
              letterSpacing: '.6rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            VANSAYA
          </Typography>


          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            {token && <IconButton size="large" color="inherit" onClick={() => router.push('/cart')}>
              <ShoppingCartIcon />
            </IconButton>
            }
            {token ? <IconButton size="large" color="inherit" onClick={handleMenuClick}>
              <AccountCircle />
            </IconButton>
              :
              <Button onClick={handleLogin}
                startIcon={<LoginIcon sx={{
                  // bgcolor:'red',
                  width: '17px'
                }} />}
                sx={{
                  color: 'white',
                  // bgcolor: 'red',
                  fontFamily: "Futura Medium",
                  fontSize: '12px'
                }}>
                Login
              </Button>
            }

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              // sx={{
              //   zIndex: 5000,
              //   [".MuiMenu-paper"]: {
              //     // borderRadius: "30px",
              //     backgroundColor: "#F3EDF7",

              //   },
              // }}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
            >
              {token ? (
                <>
                  <MenuItem onClick={handleProfileClick} sx={{ fontFamily: fahkwang.style.fontFamily }}>
                    <Stack direction={'row'} gap={1} alignItems={'center'} >
                      <Avatar
                        sx={{
                          width: '20px',
                          height: '20px'
                        }}
                      /> My Profile
                    </Stack>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ fontFamily: fahkwang.style.fontFamily }}>
                    <Stack direction={'row'} gap={1}>
                      <Logout /> Logout
                    </Stack>
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLogin} sx={{ fontFamily: fahkwang.style.fontFamily }}>
                  <Stack direction={'row'} gap={1}>
                    <LoginIcon /> Login
                  </Stack>
                </MenuItem>
              )}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar >
  );
};

export default Navbar;
