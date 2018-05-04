import express, { Router, Request, Response } from 'express';
import DummyHandler from '../handlers/dummy.handler';
import DummyService from '../../services/dummy.service';
import DummyDao from '../../data/dummy.dao';
var router: Router = express.Router();

// "DI"
const dummyService = new DummyService(DummyDao);
const dummyHandler = new DummyHandler(dummyService);

class DummyController {

    /**
     * Get's a dummy
     */
    public static getDummy = (req, res) => { 
        dummyHandler.getDummy(req, (err, result) => {
            if(err) {
                res.status(result.status);
                return res.json(err);
            }

            res.status(result.status);
            return res.json(result.json);
        }); 

    };
};

export default DummyController;