"use client"
import { Container, Divider, Grid, Link, Box, Typography } from '@mui/material';
import { pages } from '../../routes';
import {  useRouter } from 'next/navigation';
export default function Footer() {
  const router = useRouter();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'black',
        borderTop: '1px solid #e01fff',
        height: '300px',
         boxShadow: '0 -4px 10px 0 #e01fff'
      }}
    >
      <Container
        sx={{
          pt: 4,
          pb: 3
        }}
      >
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {pages.map((item, index) => item.isFooter && (
            <Grid item key={index}>
              <Typography
                sx={{
                  color: 'white',
                  fontFamily: "Futura Medium",
                  fontSize: {
                    xs: '14px',
                    sm: '16px',
                    md: '18px',
                    lg: '20px',
                  },
                  '&:hover': { color: '#ccc', cursor: 'pointer' },
                }}
                onClick={() => { router.push(item.route); }}
              >
                {item.name} 
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
