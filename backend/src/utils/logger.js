const serialize = (level, message, meta = {}) =>
  JSON.stringify({
    level,
    message,
    ...meta,
    timestamp: new Date().toISOString()
  });

export const logger = {
  info(message, meta = {}) {
    console.log(serialize("info", message, meta));
  },
  warn(message, meta = {}) {
    console.warn(serialize("warn", message, meta));
  },
  error(message, meta = {}) {
    console.error(serialize("error", message, meta));
  }
};
