import 'dotenv/config'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import router from './src/routes/index.js'
import connectDatabase from './src/configs/database.js'
import environment from './src/configs/enviroment.js'
import { errorHandlingMiddleware } from './src/middleware/errorHandlingMiddleware.js'
import ApiError from './src/utils/ApiError.js'
import cors from 'cors'

const PORT = environment.app.port;

const app = express()

connectDatabase();

// init middleware
app.use(cors())
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Routes
app.use("/api", router)

// Error handler
app.all("*", (req, res, next) => {
    const error = new ApiError(404, "Route not found")
    next(error)
})
app.use(errorHandlingMiddleware)


// run server
const server = app.listen(PORT , () => {
    console.log(`Server is running on port: ${PORT}`)
})

process.on('SIGINT', () => {
    server.close( () => console.log(`Exit server express`) )
})