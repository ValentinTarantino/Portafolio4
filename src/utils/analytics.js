export const trackEvent = (name, params) => {
  try {
    window.gtag?.('event', name, params);
  } catch {
    // Analytics never blocks the UI.
  }
};
