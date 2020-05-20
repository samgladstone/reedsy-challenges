import express from 'express';
import { addRouters } from './routes';

const app = express();
const port = 3000;

addRouters(app);

app.listen(port, function () {
    console.log('-------------------------------------------');
    console.log();
    console.log('Book Requests Porter started:');
    console.log(`Listening on port:   ${port}`);
    console.log(`Node environmemt:    ${process.env.NODE_ENV || 'development'}`);
    console.log(`Start Time:          ${new Date()}`);
    console.log();
    console.log('-------------------------------------------');
});