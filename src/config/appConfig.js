import ExpressConfig from './expressConfig';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

class AppConfig {
  
  constructor(app) {
    this.app = app;
  }

  includeConfig() {
    this.app.use(cors({
      'allowedHeaders': ['Accept', 'Content-Type', 'Origin', 'X-Requested-With'],
      'origin': '*',
    }));
    this.app.use(helmet());
    this.app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
    this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  }

}

export default AppConfig;