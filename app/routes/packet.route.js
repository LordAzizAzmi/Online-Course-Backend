module.exports = (app) => {
    const packet = require('../controllers/packet.controller.js')
    const router = require('express').Router()
    const authentication = require('../middleware/authenticationToken')
    const errorHandler = require('../error/ErrorHandler')

    router.post('/', packet.createPacket)
    router.get('/', packet.findAllPacket)
    router.get('/:id', packet.findByIdPacket)
    router.put('/:id', packet.updatePacket)
    router.delete('/:id', packet.deletePacket)

    app.use('/api/packets', authentication.authenticationToken, router)
}