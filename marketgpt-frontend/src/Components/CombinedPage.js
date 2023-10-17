import React, { useState } from "react";
import { 
    Box, Button, TextField, CircularProgress, Container, Divider, Card, CardContent, 
    Typography, Table, TableContainer, TableRow, TableHead, TableCell, TableBody, Paper,  CssBaseline, ThemeProvider, createTheme  
} from "@mui/material";
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark', // For darker theme
    primary: {
      main: '#009688', // teal
    },
    secondary: {
      main: '#ff4500', // orange-red
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '16px',
    },
    h6: {
      fontWeight: 500,
    }
  },
});


export function CombinedPage() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeRequest, setActiveRequest] = useState('');

  const handleMarketGPTSubmit = () => {
    setLoading(true);
    setResponse(null);
    setActiveRequest('market');
    axios.post('http://localhost:8000/market/',{company: inputValue})
      .then((data) => {
        setResponse(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEmailSubmit = () => {
    setLoading(true);
    setResponse(null);
    setActiveRequest('email');
    axios.post('http://localhost:8000/email/', { company: inputValue })
      .then((data) => {
        setResponse(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTweetSubmit = () => {
    setLoading(true);
    setResponse(null);
    setActiveRequest('tweet');
    axios.post('http://localhost:8000/tweets/', { plugin: inputValue })
      .then((data) => {
        setResponse(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
 const buttonStyle = {
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    margin: '10px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box style={{ display: "flex", flexDirection: "column", width: "60%", padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
          <Typography variant="h1" style={{ marginBottom: '24px', textAlign: 'center' }}>Market(ing)-GPT Prototype</Typography>
          <TextField
            id="outlined-basic"
            value={inputValue}
            placeholder="Enter Value"
            label="Input"
            variant="outlined"
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            style={{ marginBottom: "20px" }}
          />

          <Box style={{ display: "flex", justifyContent: "center", gap: '16px', marginBottom: '20px' }}>
            <Button variant="contained" style={buttonStyle} onClick={handleMarketGPTSubmit}>
              Market Analysis
            </Button>
            <Button variant="contained" style={buttonStyle} onClick={handleEmailSubmit}>
              Generate Email
            </Button>
            <Button variant="contained" style={buttonStyle} onClick={handleTweetSubmit}>
              Generate Tweet
            </Button>
          </Box>

          {loading && <CircularProgress color="secondary" style={{ margin: "20px auto", display: 'block' }} />}

          {response && (
            <Box sx={{ minWidth: 275, marginTop: "20px" }}>
              {activeRequest === 'market' && <MarketResponseComponent response={response} />}
              {activeRequest === 'email' && <EmailResponseComponent response={response} />}
              {activeRequest === 'tweet' && <TweetResponseComponent response={response} />}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
function MarketResponseComponent({ response }) {
  return (
    <div>
      <Divider />
      <h1> Main Market: {response.market}</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Competitor</b></TableCell>
              <TableCell align="center"><b>Market Cap</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.competitors.map((row) => (
              <TableRow key={row.company}>
                <TableCell component="th" scope="row">
                  {row.company}
                </TableCell>
                <TableCell align="center">{row.market_cap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function EmailResponseComponent({ response }) {
  return (
    <div>
      <Divider />
      <h1> Email:</h1>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {response[0].email}
          </Typography>
          <Typography variant="h5" component="div">
            {response[0].name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {response[0].subject}
          </Typography>
          <Typography variant="body2">
            {response[0].email_content}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function TweetResponseComponent({ response }) {
  return (
    <div>
      <Divider />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Tweet
          </Typography>
          <Typography variant="h6" component="div">
            {response.twitter_content}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}