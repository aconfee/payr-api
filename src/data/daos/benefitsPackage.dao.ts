import db from '../index';
import Bluebird from 'bluebird';
import IDao, { QueryOptions } from './IDao.dao';
import BenefitsPackage from '../../services/models/benefitsPackage.model';
import isNil from 'lodash/isNil';

export interface IBenefitsPackageDao {
    findById(id: number, options?: QueryOptions): Bluebird<BenefitsPackage>;
};

class BenefitsPackageDao implements IBenefitsPackageDao, IDao {

    /**
     * Find a benefits package by its id. 
     * 
     * @param options can specify query options like attributes to SELECT.
     * 
     * @returns the list of dependents that match the query criteria.
     */
    public findById = async (id: number, options?: QueryOptions): Bluebird<BenefitsPackage> => {
        const benefitsPackage: any = await db.BenefitsPackageSchema.findById(id, { 
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(benefitsPackage)) return null;   

        return new BenefitsPackage(
            benefitsPackage.name, 
            benefitsPackage.baseCost,
            benefitsPackage.dependentCost
        );
    };

    public findAll(options?: QueryOptions): Bluebird<BenefitsPackage[]>{
        throw Error('Not implemented.');
    };

    public findOne(options?: QueryOptions): Bluebird<BenefitsPackage>{
        throw Error('Not implemented.');
    };

    public create(record: BenefitsPackage): Bluebird<BenefitsPackage> {
        throw Error('Not implemented.');
    };

    public destroy(id: number): Bluebird<boolean> {
        throw Error('Not implemented.');
    };
};

export default BenefitsPackageDao;