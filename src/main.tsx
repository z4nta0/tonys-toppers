import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AppRooCom } from './app.tsx';
import './styles/fonts.css';  // What: Fonts Stylesheet. Why: The site's self-hosted font faces have to register before anything styled with them. How: This loads fonts.css first.
import './styles/styles.css'; // What: Global Stylesheet. Why: The site's styles apply everywhere. How: This loads styles.css after the font faces it uses.

ReactDOM.createRoot(document.getElementById( 'appMouDiv' )!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRooCom />
    </BrowserRouter>
  </React.StrictMode>
);
