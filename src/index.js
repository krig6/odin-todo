import './styles/global.css'
import './styles/project.css'
import './styles/list.css'
import './styles/todo.css'
import './styles/toast.css'

import { appController } from './controllers/appController.js';

const app = appController();

app.init();
