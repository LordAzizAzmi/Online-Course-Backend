const db = require('../models')
const packet = db.packet

exports.findAll = (req, res) => {

    packet.aggregate([
        {
            $lookup: {
                from: 'courses',
                localField: 'course_list',
                foreignField: 'code',
                as: 'course_list'
            }
        }
    ])
        .then(result => {
            res.status(200).send({
                status: true,
                message: 'Data found',
                data: result
            })
        })
        .catch(err => {
            res.status(409).send({
                message: err.message
            })
        });
}

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: 'Name cannot be empty.' })
        return
    }

    const packet = new packet({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    packet
        .save(packet)
        .then(data => {
            res.status(201).send({
                message: 'packet created successfully',
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the packet.'
            })
        })
}

exports.findPacket = (req, res) => {
    const id = Number(req.params.id)

    packet.aggregate([
        {
            $match: {
                packet_id: id
            }
        }
        ,{
            $lookup: {
                from: 'courses',
                localField: 'course_list',
                foreignField: 'code',
                as: 'course_list'
            }
        }
    ])
        .then(result => {
            res.status(200).send({
                status: true,
                message: 'Data found',
                data: result
            })
        })
        .catch(err => {
            res.status(409).send({
                message: err.message
            })
        });
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update cannot be empty!'
        })
    }

    const id = req.params.id

    packet.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update packet with id=${id}. Maybe packet was not found!`
                })
            } else res.status(200).send({ message: 'packet was updated successfully.' })
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating packet with id=' + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    packet.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete packet with id=${id}. Maybe packet was not found!`
                })
            } else {
                res.status(200).send({
                    message: 'packet was deleted successfully!'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete packet with id=' + id
            })
        })
}