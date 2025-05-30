import React from 'react';
import './App.css';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { AppComponent } from './Component/App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1368bf',
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}> <AppComponent /> </ThemeProvider>
    </div>
  );
}

export default App;
