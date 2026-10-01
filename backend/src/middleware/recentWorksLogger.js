function recentWorksLogger(req, res, next) {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const isError = status >= 400;
    const logMsg = `[RecentWorks API] ${method} ${url} -> ${status} (${duration}ms)`;
    if (isError) {
      console.warn(logMsg);
    } else {
      console.log(logMsg);
    }
  });

  next();
}

module.exports = recentWorksLogger;
