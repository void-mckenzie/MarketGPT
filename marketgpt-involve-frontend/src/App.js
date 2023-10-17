import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CombinedPage } from "./Components/CombinedPage";
import { Box, AppBar, Toolbar, Typography, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // deep purple
    },
    secondary: {
      main: '#ffb300', // amber
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '16px',
    },
    h6: {
      fontWeight: 500,
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <AppBar component="nav" position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                Market Research 
              </Typography>
              {/* Removed the button */}
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={<CombinedPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
