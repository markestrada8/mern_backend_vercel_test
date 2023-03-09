const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorMiddleware')

const app = express()
connectDB()
const PORT = process.env.PORT || 8000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api/todos', require('./routes/todoRoutes'))
app.use('/api/user', require('./routes/userRoutes'))


// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')))

//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
// } else {
//   app.get('/', (req, res) => res.send('Please set to production'))
// }

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))