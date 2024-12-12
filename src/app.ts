import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandeler from './middleware/globalErrorHndeler';
import routeNotFound from './middleware/routNotFound';
import router from './routes';
const app: Application = express();
import cookieParser from 'cookie-parser';

// middleWare
app.use(cors());
// json perser
app.use(express.json());
// cookie perser
app.use(cookieParser())
// custome routes
app.use('/api/v1', router);


app.get('/', (req, res) => {
  res.send('Hello World yoooooooooooooooo!');
});

app.use(routeNotFound)
app.use(globalErrorHandeler)


export default app;
