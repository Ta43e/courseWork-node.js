import express, { Request, Response, NextFunction, Express } from 'express';
import parser from 'body-parser';
import cookieParser from 'cookie-parser';
import { routes } from './routes/defaultRoute';
import path  from 'path';
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import onSocket from "./chat/socket";
import { connect } from 'mongoose';

const app: Express = express();
app.use(parser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(parser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '..', "frontend/public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join('../frontend/views/'));
app.set('view engine', 'ejs');

async function run() {
    connect(
        'mongodb+srv://admin:wwwwww@coursework.dbqh5v0.mongodb.net/CourseWork?retryWrites=true&w=majority&appName=CourseWork'
      )
      .then(() => {
        console.log('DB OK');
      })
      .catch(() => {
        console.log('ERROR');
      }); 
  };
run();
app.use('/', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Not found' });
});

  let options =
  {
      key: fs.readFileSync('LAB.KEY'),
      passphrase: 'key1',
      cert: fs.readFileSync('LAB.crt')
  };

const httpServer = https.createServer(options, app);
const io = new Server(httpServer);
onSocket(io);

httpServer.listen(8080, () => {
    console.log(`Server is running on https://localhost:8080`);
});