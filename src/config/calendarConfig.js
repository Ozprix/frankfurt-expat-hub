export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_REDIRECT_URI = `${window.location.origin}/calendar/google/callback`;
export const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const OUTLOOK_CLIENT_ID = import.meta.env.VITE_OUTLOOK_CLIENT_ID;
export const OUTLOOK_REDIRECT_URI = `${window.location.origin}/calendar/outlook/callback`;
export const OUTLOOK_SCOPES = 'Calendars.ReadWrite offline_access';

export const getGoogleOAuthURL = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: GOOGLE_SCOPES,
    state: 'google_auth_state', // Should be random string in prod
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const getOutlookOAuthURL = () => {
  const rootUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  const options = {
    client_id: OUTLOOK_CLIENT_ID,
    response_type: 'code',
    redirect_uri: OUTLOOK_REDIRECT_URI,
    response_mode: 'query',
    scope: OUTLOOK_SCOPES,
    state: 'outlook_auth_state',
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};