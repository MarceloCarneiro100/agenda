exports.checkCsrfError = (err, req, res, next) => {
  if(err && err.code === 'EBADCSRFTOKEN') {
    // aqui pode ser renderizada uma página 404 se desejar. Mas o erro aqui não é 404! É apenas um exemplo.
    return res.render('404');
  }
}

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}

