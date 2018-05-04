import DummyController from './controllers/dummy.controller';
import express, { Router } from 'express';
var router: Router = express.Router();

class HandlerResult {
  public status: number;
  public json?: any;
}

export interface IHandlerCallback {
  (err: Error, result: HandlerResult): void;
};

router.get('/api/v1/dummy', DummyController.getDummy);

router.get('/', (req, res, next) => {
  res.status(200);
  res.json('Working :)');
});

export default router;
