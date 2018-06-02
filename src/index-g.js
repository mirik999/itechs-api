// routes
import auth from './routes/authenticate';
import article from './routes/article';
import feedback from './routes/feedback';
import profile from './routes/profile';
import Article from './models/article-model';
// sockets
import sockets from './sockets/sockets';

import express from 'express';
import http from 'http';
import socket from 'socket.io';

import socketEvents from './sockets/socketEvents';
import routes from './routes/routes';
import appConfig from './config/appConfig';

class Server {

  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
    this.socket = socket(this.http);
  }

  //all settings and middlewares
  appConfig() {
    new this.appConfig(this.app).includeConfig();
  }

  //Including Routes and Sockets classes
  includeRoutes() {
    new routes(this.app).routesConfig();
    new socketEvents(this.socket).socketConfig();
  }

  //server start
  appExecute() {
    this.appConfig();
    this.includeRoutes();

    const port = process.env.PORT || 4000;
    const host = process.env.HOST || `localhost`;

    this.http.listen(port, () => {
      console.log(`Listening on http://${host}:${port}`)
    })
  }

}

const app = new Server();
app.appExecute();