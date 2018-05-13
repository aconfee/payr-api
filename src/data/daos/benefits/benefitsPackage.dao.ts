import db from '../../index';
import Bluebird from 'bluebird';
import IDao, { QueryOptions } from '../IDao.dao';
import BenefitsPackageDM from '../../models/benefits/benefitsPackage.datamodel';
import isNil from 'lodash/isNil';

export interface IBenefitsPackageDao {
    findById(id: number, options?: QueryOptions): Bluebird<BenefitsPackageDM>;
};

class BenefitsPackageDao implements IBenefitsPackageDao, IDao {

    /**
     * Find a benefits package by its id. 
     * 
     * @param options can specify query options like attributes to SELECT.
     * 
     * @returns the list of dependents that match the query criteria.
     */
    public findById = async (id: number, options?: QueryOptions): Bluebird<BenefitsPackageDM> => {
        const row: any = await db.BenefitsPackageSchema.findById(id, { 
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(row)) return null;   

        return new BenefitsPackageDM(
            row.id,
            row.name, 
            row.baseCost,
            row.dependentCost,
            row.createdAt,
            row.updatedAt
        );
    };

    public findAll(options?: QueryOptions): Bluebird<BenefitsPackageDM[]>{
        throw Error('Not implemented.');
    };

    public findOne(options?: QueryOptions): Bluebird<BenefitsPackageDM>{
        throw Error('Not implemented.');
    };

    public create(record: BenefitsPackageDM): Bluebird<BenefitsPackageDM> {
        throw Error('Not implemented.');
    };

    public destroy(id: number): Bluebird<boolean> {
        throw Error('Not implemented.');
    };
};

export default BenefitsPackageDao;