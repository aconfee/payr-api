/**
 * These daos decouple Sequelize from the rest of the app. I could, for example,
 * swap out Sequelize with Knex and these dao classes are the only things that would have to be updated.
 */

import db from '../index';
import Bluebird from 'bluebird';
import Employee from '../../services/models/employee.model';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IEmployeeDao {
    findAll(): Bluebird<Employee[]>;
    create(firstname: string, lastname: string): Bluebird<Employee>;
    destroyById(id: number): Bluebird<boolean>;
};

class EmployeeDao implements IEmployeeDao {

    /**
     * Get all employees and map to model.
     */
    public findAll = async (): Bluebird<Employee[]> => {
        const rows: any = await db.EmployeeSchema.findAll({
            attributes: ['id', 'firstname', 'lastname']
        })
        .catch((e) => { console.error(e); });

        if(isNull(rows) || isUndefined(rows)){
            return null;
        }

        const employees = rows.map((row: any) => {
            return new Employee(
                row.id,
                row.firstname, 
                row.lastname
            );
        });

        return employees;
    };

    /**
     * Create an employee (or return an existing one that matches criteria).
     * 
     * @param firstname of the employee that will be created.
     * @param lastname of the employee that will be created.
     * 
     * @returns the newly created, or existing and found employee.
     */
    public create = async (firstname: string, lastname: string): Bluebird<Employee> => {
        const result: any = await db.EmployeeSchema.create({ firstname, lastname });

        if(isNull(result.id) || isUndefined(result.id)) return null;

        return new Employee(result.id, result.firstname, result.lastname);
    };

    /**
     * Remove an employee entry from our db. 
     * 
     * @param id Identifier for the entry to delete.
     * 
     * @returns whether or not the entry was deleted.
     */
    public destroyById = async (id: number): Bluebird<boolean> => {
        const deleted = await db.EmployeeSchema.destroy({ where: { id: id }})
            .catch((e) => { console.error(e); });

        return deleted === 1;
    };
};

export default EmployeeDao;