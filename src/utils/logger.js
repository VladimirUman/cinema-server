exports.logger = (req, res, next) => {
    const date = new Date().toLocaleString();
    const body = JSON.stringify(req.body);

    console.log(`${date} ${req.method} ${req.originalUrl} -- ${body}`);

    return next();
};
