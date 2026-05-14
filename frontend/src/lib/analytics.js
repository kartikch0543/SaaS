import ReactGA from "react-ga4";

let isGaInitialized = false;
let lastTrackedPage = "";

const getMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export const initGA = () => {
  const measurementId = getMeasurementId();

  if (!measurementId || isGaInitialized || typeof window === "undefined") {
    return false;
  }

  ReactGA.initialize(measurementId);
  isGaInitialized = true;
  return true;
};

export const trackPageView = (path) => {
  if (!isGaInitialized || !path || lastTrackedPage === path) {
    return;
  }

  lastTrackedPage = path;
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: typeof document !== "undefined" ? document.title : undefined
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!isGaInitialized || !eventName) {
    return;
  }

  ReactGA.event(eventName, params);
};

export const trackAiEvent = (action, params = {}) => {
  trackEvent(action, {
    app_area: "ai_tools",
    ...params
  });
};
