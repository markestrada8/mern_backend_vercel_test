const asyncHandler = require('express-async-handler')
const Todo = require('../models/todoModel');

const getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id })
  res.status(200).json(todos)
})


const createTodo = asyncHandler(async (req, res) => {
  try {
    const todo = await Todo.create({
      task: req.body.task,
      user: req.user.id
    })
    res.status(201).json(todo)
  }
  catch {
    res.status(400)
    throw new Error("Enter a task!!!")
  }
})


const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  if (!todo) {
    res.status(400)
    throw new Error("Todo does not exist")
  }

  if (!req.user) {
    res.status(401)
    throw new Error("user not found")
  }

  if (req.user.id !== todo.user.toString()) {
    res.status(400)
    throw new Error("UnAuthorized")
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(updatedTodo)

})


const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  if (!todo) {
    res.status(400)
    throw new Error(`Todo with id of ${req.params.id} does not exist`)
  }

  if (!req.user) {
    res.status(401)
    throw new Error("User not found")
  }

  if (todo.user.toString() !== req.user.id) {
    res.status(400)
    throw new Error("UnAuthorized")
  }
  todo.remove()
  res.status(201).json({
    id: req.params.id
  })
})

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
}