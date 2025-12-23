import { FinanceModel } from './model/FinanceModel.js';
import { FinanceView } from './view/FinanceView.js';
import { FinanceController } from './controller/FinanceController.js';

// Unindo as peças
const app = new FinanceController(new FinanceModel(), new FinanceView());
app.init();