// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import App from './App.jsx';

// Define GlobalStyles component
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Josefin Sans', sans-serif;

  }
  h1 {
   font-family: 'Lilita One', sans-serif;

  }
  h2 {
    font-family: 'Luckiest Guy', cursive;
  }


  // Add any other global styles here
`;

// Render the App component with global styles
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
  </>
);
