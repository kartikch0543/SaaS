const appendScript = (src) => {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

export const initAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  if (gaId && !window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }

  if (clarityId && !window.clarity) {
    ((c, l, a, r, i, t, y) => {
      c[a] =
        c[a] ||
        function clarity() {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityId);
  }
};

export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag("event", "page_view", { page_path: path });
  }
};
