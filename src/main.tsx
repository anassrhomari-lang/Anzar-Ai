import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.tsx';
import './index.css';

// Initialize PostHog
if (typeof window !== 'undefined') {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';
  
  if (posthogKey) {
    console.log("PostHog initialized with key:", posthogKey.substring(0, 8) + "...");
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: true,
      persistence: 'localStorage',
      autocapture: true,
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
