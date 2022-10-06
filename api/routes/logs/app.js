const express = require('express');
const app = express();
const isValid = require('./isValid');
const loggers = require('./loggers');

app.all("*", (req, res, next) => {
    loggers.info("Incoming request", { method: req.method});

    loggers.debug("Debug request",{
        headers: req.header,
        query: req.query,
        body: req.body
    });

    return next();
});

app.get("/", isValid, (req,res) => {
    loggers.info("/ query", {query: req.query})

    const msg = {q: req.query.q}
    loggers.info("/ response", msg);

    res.json(msg);
});

module.exports = app;