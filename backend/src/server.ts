import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'


dotenv.config()
import authRoutes from './routes/auth.routes'
import capsuleRoutes from './routes/capsule.routes'
import './jobs/capsule.unlock'


const app: Express = express()
const PORT: string | number = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'https://tothenextversion-xyjc.vercel.app',
  credentials: true,
}))

app.use(express.json())
app.use(fileUpload())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/capsules', capsuleRoutes)

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'To the Next Version API is running!' })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected!')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err.message)
  })