const db = require('../models')
const Course = db.course

exports.createCourse = (req, res) => {
    if (!req.body.code) {
        res.status(400).send({ message: 'Code cannot be empty.' })
        return
    }

    const course = new Course({
        code: req.body.code,
        course: req.body.course,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.body.imageUrl
    })

    course
        .save(course)
        .then(data => {
            res.status(201).send({
                status: 'success',
                message: 'course was created successfully',
                data: {
                    courseId: data._id,
                }
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Course.'
            })
        })
}


exports.findAllCourse = (req, res) => {
    Course.find()
        .then(result => {
            res.status(200).send({
                status: true,
                message: 'Data found',
                data: {
                    courses: [
                        result
                    ]
                }
            })
        })
        .catch(err => {
            res.status(409).send({
                message: err.message
            })
        });
}

exports.findByIdCourse = (req, res) => {
    const id = req.params.id

    Course.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: 'Not found Course with id ' + id })
            else res.send(data)
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Error retrieving Course with id=' + id })
        })
}

exports.updateCourse = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!'
        })
    }

    const id = req.params.id

    Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Course with id=${id}. Maybe Course was not found!`
                })
            } else res.send({ message: 'Course was updated successfully.' })
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating Course with id=' + id
            })
        })
}

exports.deleteCourse = (req, res) => {
    const id = req.params.id

    Course.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
                })
            } else {
                res.send({
                    message: 'Course was deleted successfully!'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Course with id=' + id
            })
        })
}