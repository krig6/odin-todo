import '../style/global.css';
import '../style/project.css';
import '../style/list.css';
import '../style/todo.css';

import { appController } from './controllers/appController.js';

const app = appController();

app.init();
