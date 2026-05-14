import ReactGA from "react-ga4";

let isGaInitialized = false;
let lastTrackedPage = "";

const getMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

const canUseBrowserApis = () => typeof window !== "undefined" && typeof document !== "undefined";

const getPageTitle = () => (canUseBrowserApis() ? document.title : undefined);

const getPageLocation = (path) => (canUseBrowserApis() ? `${window.location.origin}${path}` : undefined);

export const initGA = () => {
  const measurementId = getMeasurementId();

  if (!measurementId || isGaInitialized || !canUseBrowserApis()) {
    return false;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      anonymize_ip: true
    },
    gtagOptions: {
      send_page_view: false
    }
  });

  isGaInitialized = true;
  return true;
};

export const trackPageView = (path) => {
  if (!isGaInitialized || !path || lastTrackedPage === path) {
    return;
  }

  lastTrackedPage = path;
  const measurementId = getMeasurementId();

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      send_to: measurementId,
      page_path: path,
      page_title: getPageTitle(),
      page_location: getPageLocation(path)
    });
    return;
  }

  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: getPageTitle()
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!isGaInitialized || !eventName) {
    return;
  }

  const measurementId = getMeasurementId();

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      send_to: measurementId,
      ...params
    });
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
