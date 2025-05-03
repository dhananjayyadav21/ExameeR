import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Determine the container to render into
const path = window.location.pathname;
const targetId = path === '/' ? 'main' : 'root'; // Render into <main> only on "/"
let container = document.getElementById(targetId);

if (targetId === 'main') {
  container.classList.remove('d-none');
}

// Safety check in case the element doesn't exist
if (!container) {
  console.error(`Element with id="${targetId}" not found in index.html`);
  container = document.getElementById("root");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);
