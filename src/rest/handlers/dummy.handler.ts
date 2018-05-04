import DummyService, { IDummyService } from '../../services/dummy.service';
import Dummy from '../../services/models/dummy.model';
import DummyDao from '../../data/dummy.dao';
import { IHandlerCallback } from '../routes';
import { Request } from 'express';

class DummyHandler {

    private dummyService = null;

    constructor(dummyService: IDummyService){
        this.dummyService = dummyService;
    };

    /**
     * Handle request to get a dummy.
     */
    public getDummy = async (req: Request, callback: IHandlerCallback) => {
        const id = 1;

        const dummy: Dummy = await this.dummyService.findDummySql(id);

        if(!dummy){
            callback(
                new Error('Dummy not found.'), 
                { status: 404 }
            );

            return;
        }

        callback(null, {
            status: 200, 
            json: JSON.parse(JSON.stringify(dummy))
        });
    };

};

export default DummyHandler;