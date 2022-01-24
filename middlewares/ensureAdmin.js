module.exports = (failureRedirect) => {
    return (req, res, next) => {
        if (
            !(
                req.isAuthenticated() &&
                req.user.role === 'ADMIN' &&
                req.user.email === process.env.ADMIN_EMAIL
            )
        ) {
            return res.redirect(failureRedirect)
        }
        next()
    }
}
