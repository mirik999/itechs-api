import express from 'express';
import path from 'path';

class ExpressConfig {

  constructor(app) {
      app.use(express.static(path.join(__dirname, 'build')))
  }

}

export default ExpressConfig;
