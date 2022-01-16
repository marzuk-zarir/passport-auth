exports.notFoundHandler = (req, res, next) => {
    res.status(404).render('error-4xx')
}

exports.internalError = (error, req, res, next) => {
    res.status(500)
    res.app.get('env') !== 'production'
        ? res.render('error-5xx', { error: error })
        : res.render('error-5xx', {
              error: 'Something went wrong. Please try again later.'
          })
}
