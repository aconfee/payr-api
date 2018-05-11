import db from '../index';
import Bluebird from 'bluebird';
import Dependent from '../../services/models/dependent.model';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IDependentDao {
    findAllByEmployeeId(employeeId: number, attributes: string[]): Bluebird<Dependent[]>;
    create(employeeId: number, firstname: string, lastname: string): Bluebird<Dependent>;
    destroyById(id: number): Bluebird<boolean>;
};

class DependentDao implements IDependentDao {

    public findAllByEmployeeId = async (employeeId: number, attributes: string[]): Bluebird<Dependent[]> => {
        const dependentRows: any = await db.DependentSchema.findAll({ 
            where: { employeeId },
            attributes
        })
        .catch((e) => { console.error(e); });

        if(isNull(dependentRows) || isUndefined(dependentRows)){
            return null;
        }

        const dependents = dependentRows.map((dependentRow) => {
            return new Dependent(
                dependentRow.id,
                dependentRow.firstname, 
                dependentRow.lastname
            );
        });

        return dependents;
    };

    /**
     * Create a dependent.
     * 
     * @param employeeId Id of the employee that this dependent belongs to.
     * @param firstname of the dependent that will be created.
     * @param lastname of the dependent that will be created.
     * 
     * @returns the newly created dependent.
     */
    public create = async (employeeId: number, firstname: string, lastname: string): Bluebird<Dependent> => {
        const result: any = await db.DependentSchema.create({ employeeId, firstname, lastname });

        if(isNull(result.id) || isUndefined(result.id)) return null;

        return new Dependent(result.id, result.firstname, result.lastname);
    };

    /**
     * Remove a dependent entry from our db. 
     * 
     * @param id Identifier for the entry to delete.
     * 
     * @returns whether or not the entry was deleted.
     */
    public destroyById = async (id: number): Bluebird<boolean> => {
        const deleted = await db.DependentSchema.destroy({ where: { id: id }})
            .catch((e) => { console.error(e); });

        return deleted === 1;
    };
};

export default DependentDao;