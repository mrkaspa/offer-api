import 'reflect-metadata'
import express, { Request, Response, Application } from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from '@/config/database'
import routes from '@/routes'

//For env File
dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(error => console.log('Error during Data Source initialization:', error))

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server')
})

// API Routes
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
