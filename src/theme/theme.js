// theme.js
"use client"
import { createTheme } from "@mui/material";



// Dark mode styles for generic elements
export const darkModeStyles = {
  backgroundColor: '#333',   // Dark background color
  color: '#fff',             // Light text color
  border: '1px solid #555',  // Dark border
  padding: '10px',
  borderRadius: '5px',
  textAlign: 'center',
  width: '100%',             // Ensure full width
};

// Styles for focus states
export const focusStyles = {
  borderColor: '#777',       // Lighter border on focus
  outline: 'none',
};

// Theme configuration for MUI components
const theme = createTheme({
  palette: {
    mode: 'dark', // This sets the dark mode
    primary: {
      main: '#90caf9', // Example primary color
    },
    secondary: {
      main: '#f48fb1', // Example secondary color
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Custom styles for TextField
          '& .MuiInputBase-root': {
            color: 'white', // Text color
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)', // Label color
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e01fff', // Border color
            },
            '&:hover fieldset': {
              borderColor: '#e01fff', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e01fff', // Border color when focused
            },
          },
        },
      },
    },
  },
});

export default theme;
