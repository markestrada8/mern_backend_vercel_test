const express = require('express')
const router = express.Router()

const { getAllTodos , createTodo, updateTodo, deleteTodo} = require('../controllers/todoControllers')
const protect = require('../middlewares/authMiddleware')

router.get('/',protect, getAllTodos)
router.post('/', protect,createTodo)
router.put('/:id', protect, updateTodo)
router.delete('/:id', protect, deleteTodo)

module.exports = router