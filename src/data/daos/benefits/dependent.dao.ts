import db from '../../index';
import Bluebird from 'bluebird';
import DependentDM from '../../models/benefits/dependent.datamodel';
import isNil from 'lodash/isNil';
import IDao, { QueryOptions } from '../IDao.dao';

export interface IDependentDao {
    findAll(options?: QueryOptions): Bluebird<DependentDM[]>;
    create(record: DependentDM): Bluebird<DependentDM>
    destroy(id: number): Bluebird<boolean>;
};

class DependentDao implements IDependentDao, IDao {

    public findById(id: number, options?: QueryOptions): Bluebird<DependentDM>{
        throw Error('Not implemented.');
    }; 

    /**
     * Find all dependents. 
     * 
     * @param options can specify query options like WHERE criteria and attributes to SELECT.
     * 
     * @returns the list of dependents that match the query criteria.
     */
    public findAll = async (options?: QueryOptions): Bluebird<DependentDM[]> => {
        const rows: any = await db.DependentSchema.findAll({ 
            where: options.where,
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(rows)) return null;

        const dependents = rows.map((row) => {
            return new DependentDM(
                row.id,
                row.employeeId,
                row.firstname, 
                row.lastname,
                row.createdAt,
                row.updatedAt
            );
        });

        return dependents;
    };

    public findOne(options?: QueryOptions): Bluebird<DependentDM>{
        throw Error('Not implemented.');
    };

    /**
     * Create a dependent.
     * 
     * @param record a model of the record to create.
     * 
     * @returns the newly created dependent.
     */
    public create = async (record: DependentDM): Bluebird<DependentDM> => {
        const { employeeId, firstname, lastname } = record;
        const error = isNil(employeeId) || isNil(firstname) || isNil(lastname);
        if(error) throw Error(`Can't create dependent. Missing information. ${record}.`);

        const result: any = await db.DependentSchema.create({ employeeId, firstname, lastname });

        if(isNil(result.id)) return null;

        return new DependentDM(
            result.id, 
            result.employeeId, 
            result.firstname, 
            result.lastname,
            result.createdAt,
            result.updatedAt
        );
    };

    /**
     * Remove a dependent entry from our db. 
     * 
     * @param id Identifier for the entry to delete.
     * 
     * @returns whether or not the entry was deleted.
     */
    public destroy = async (id: number): Bluebird<boolean> => {
        const deleted = await db.DependentSchema.destroy({ where: { id: id }})
            .catch((e) => { console.error(e); });

        return deleted === 1;
    };
};

export default DependentDao;