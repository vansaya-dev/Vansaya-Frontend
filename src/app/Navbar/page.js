// components/ResponsiveAppBar.js
"use client";
import React, { useState } from 'react';
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
import { Stack } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import Cart icon
import LoginIcon from '@mui/icons-material/Login'; // Import Login icon
import { useRouter } from "next/navigation";
const fahkwang = Fahkwang({ subsets: ['latin'], weight: ['400'] });

const pages = [
  { name: 'Home', route: '/' },
  { name: 'Products', route: '/products' },
  { name: 'Experience', route: '/experience' },
  { name: 'About', route: '/about' },
  { name: 'Contact', route: '/contact' }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
            {/* Left side: Login button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={() => { router.push('/login'); }}
                startIcon={<LoginIcon />}
                sx={{ color: 'white' }}
              >
                Login
              </Button>
            </Box>

            {/* Center: Logo and Menu Items */}
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Logo */}
              <Box sx={{ mb: 2, mt: 1 }}>
                <Typography
                  variant="h4"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    fontFamily: fahkwang.style.fontFamily,
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  Vansaya
                </Typography>
              </Box>

              {/* Menu Items */}
              <Stack direction="row" spacing={6} justifyContent="center">
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={() => { router.push(page.route); }}
                    sx={{ color: 'white' }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Right side: Cart button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="cart"
                color="inherit"
              >
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
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
              <List>
                {pages.map((page) => (
                  <ListItem key={page.name} disablePadding>
                    <ListItemButton
                      href={page.route}
                      onClick={() => { router.push(page.route); }}
                    >
                      <ListItemText primary={page.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Title in Mobile View */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: fahkwang.style.fontFamily,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Vansaya
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
