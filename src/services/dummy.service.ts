import Dummy from './models/dummy.model';
import DummyDao from '../data/dummy.dao';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import Sequelize from 'sequelize';
import _ from 'lodash';


export interface IDummyService {
    findDummySql(id: number): any;
};

/**
 * Dummy
 */
class DummyService implements IDummyService {

    private dummyDao: Sequelize.Model<{}, {}> = null;

    constructor(dummyDao: Sequelize.Model<{}, {}>) {
        this.dummyDao = dummyDao;
    };

    /**
     * Get a dummy from the posgres RDS instance.
     * 
     * @return {Bluebird<void | Dummy} A promise whos contents is the dummy with the provided id.
     */
    public findDummySql = async (id: number): Bluebird<void | Dummy> => {
        const dummyRow: any = await this.dummyDao.findById(1)
            .catch((e) => { console.error(e); });

        if(_.isNull(dummyRow) || _.isUndefined(dummyRow)){
            return null;
        }

        return new Dummy(dummyRow.get('message'));
    };

};

export default DummyService;