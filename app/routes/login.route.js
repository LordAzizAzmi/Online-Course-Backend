module.exports = (app) => {
    const users = require('../controllers/login.controller')
    const router = require('express').Router()

    router.post('/', users.loginUser)

    app.use('/api/login', router)
}