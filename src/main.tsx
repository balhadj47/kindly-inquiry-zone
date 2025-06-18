
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Only log in development
if (import.meta.env.DEV) {
  console.log('🌟 Main: Starting application...');
  console.log('🌟 Main: App component:', App);
}

const rootElement = document.getElementById("root");

if (import.meta.env.DEV) {
  console.log('🌟 Main: Root element:', rootElement);
}

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

if (import.meta.env.DEV) {
  console.log('🌟 Main: React root created, rendering App...');
}

root.render(<App />);

// Register service worker after the app is rendered
registerServiceWorker().then((registration) => {
  if (registration) {
    console.log('🔧 Service Worker registered with scope:', registration.scope);
  }
}).catch((error) => {
  console.error('🔧 Service Worker registration error:', error);
});
