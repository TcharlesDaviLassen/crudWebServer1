const logger = require('./loggers')

module.exports = (req, res, next) => {
    logger.info("Info de erro", { query: req.query })

    if (req.query.q == 1) {
        const error = { error: "Invaled" }
        logger.info("Request failed", error)
        return error
    } else if (!req.query.q) {
        const error = { error: " Error !", error }
        return res.json(error)
    }

    return next();
}