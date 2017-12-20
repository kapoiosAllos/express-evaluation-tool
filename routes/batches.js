// routes/batches.js
const router = require('express').Router()
const { Batch } = require('../models')
const { Student } = require('../models')
const passport = require('../config/auth')

router.get('/batches', (req, res, next) => {
  Batch.find()
    // Newest batches first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((batches) => res.json(batches))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })
  .get('/batches/:id', (req, res, next) => {
    const id = req.params.id
    Batch.findById(id)
      .then((batch) => {
        if (!batch) { return next() }
        Student.find({'_id': {$in: [...batch.studentId]}})
        .then((student)=> {
          if (!student) { return next() }
          res.json(student)
        })
        //res.json(batch)
      })
      .catch((error) => next(error))
  })
  .post('/batches',
    passport.authorize('jwt', { session: false }),
    (req, res, next) => {
      let newBatch = req.body
      newBatch.authorId = req.account._id

      Batch.create(newBatch)
        .then((batch) => res.json(batch))
        .catch((error) => next(error))
    })
  .put('/batches/:id', (req, res, next) => {
    const id = req.params.id
    Batch.findById(id)
      .then((batch) => {
        if (!batch) { return next() }

        const newData = req.body

        batch.update(newData)
          .then((updatedBatch) => {
            res.json(updatedBatch)
          })
          .catch((error) => next(error))
      })
      .catch((error) => next(error))
  })
  .put('/batches/:id/student/:studentId', (req, res, next) => {
    const id = req.params.id
    var mongoose = require('mongoose')
    const studentId = mongoose.Types.ObjectId(req.params.studentId)
    Batch.findById(id)
      .then((batch) => {
        if (!batch) { return next() }

        const newData = batch
        newData.studentId.push(studentId)
        console.log(newData)
        //newData.studentId.push(studentId)

        batch.update(newData)
          .then((updatedBatch) => {
            res.json(updatedBatch)
          })
          .catch((error) => next(error))
      })
      .catch((error) => next(error))
  })
  .get('/batches/:id/student', (req, res, next) => {
    const id = req.params.id
    var randomNumber = Math.random()

    function shuffle(array){
      var i = 0
      , j = 0
      , temp = null
      for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    }

    function chooseStudent(array, number) {
      console.log(array)
      if (number < 0.5) {
        //return array.find(array.evaluations.color === "red")
        const redStudent = array.filter(function(student) {
          return student.evaluations[student.evaluations.length-1].color ==="red" })
        console.log("red"+redStudent)
        return redStudent
      }
      else if (number >= 0.5 && number <0.83) {
        //return array.find(array.evaluations.color === "orange")
        const orangeStudent = array.filter(function(student) {
          return student.evaluations[student.evaluations.length-1].color ==="orange" })
        console.log("orange"+orangeStudent)
        return orangeStudent
      }
      else {
        //return array.find(array.evaluations.color === "green")
        const greenStudent = array.filter(function(student) {
          return student.evaluations[student.evaluations.length-1].color ==="green" })
        console.log("green"+greenStudent)
        return greenStudent
      }
      return array[0]
    }

    Batch.findById(id)
      .then((batch) => {
        if (!batch) { return next() }
          //const studentsOfBatch = batch.studentId
          //const arrayOfStudent = studentsOfBatch.map(x => { console.log(x);return Student.findById(x)})
          Student.find({'_id': {$in: [...batch.studentId]}})
          .then((arrayOfStudent) => {
          const shuffledArray = shuffle(arrayOfStudent)
          console.log(randomNumber)
          const luckyStudent = chooseStudent(shuffledArray, randomNumber)
          res.json(luckyStudent[0])
        //.then((luckyStudent) => {
      //  res.json(luckyStudent)
     // })
      })
      })
      .catch((error) => next(error))
  })

module.exports = router
