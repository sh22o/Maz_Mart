import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import {AppRouter} from './src/modules/index.router.js'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import cors from 'cors'

const port = process.env.PORT ||5000

const app = express() 
//convert Buffer Data
app.use(express.json()) 
app.use(express.urlencoded({extended:false}))
app.use(cors({}))


AppRouter(app)






app.listen(port, () => console.log(`Example app listening on port ${port}!`))