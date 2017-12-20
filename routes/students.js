// routes/students.js
const router = require('express').Router()
const { Student } = require('../models')
const passport = require('../config/auth')

router.get('/students', (req, res, next) => {
  Student.find()
    // Newest students first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((students) => res.json(students))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })
  .get('/students/:id', (req, res, next) => {
    const id = req.params.id
    Student.findById(id)
      .then((student) => {
        if (!student) { return next() }
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .post('/students',
    passport.authorize('jwt', { session: false }),
    (req, res, next) => {
      let newStudent = req.body
      newStudent.authorId = req.account._id

      Student.create(newStudent)
        .then((student) => res.json(student))
        .catch((error) => next(error))
    })
  .put('/students/:id', (req, res, next) => {
    const id = req.params.id
    Student.findById(id)
      .then((student) => {
        if (!student) { return next() }

        const newData = req.body

        student.update(newData)
          .then((updatedStudent) => {
            res.json(updatedStudent)
          })
          .catch((error) => next(error))
      })
      .catch((error) => next(error))
  })

module.exports = router
