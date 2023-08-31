import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
import { errorHandler } from './middleware/errorHandler.js';
import { dbConnection } from './config/dbConnection.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';


dbConnection();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/api', (req, res) => res.send('Server ready'));
app.use('/api/users/', userRoutes);

app.use(errorHandler);

app.listen(port, () => console.log("Server started on Port :", port));