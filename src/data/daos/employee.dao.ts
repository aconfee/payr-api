import db from '../index';
import Bluebird from 'bluebird';
import IDao, { QueryOptions } from './IDao.dao';
import Employee from '../../services/models/employee.model';
import isNil from 'lodash/isNil';

export interface IEmployeeDao {
    findById(id: number, options?: QueryOptions): Bluebird<Employee>;
    findAll(options?: QueryOptions): Bluebird<Employee[]>;
    create(record: Employee): Bluebird<Employee>;
    destroy(id: number): Bluebird<boolean>;
};

class EmployeeDao implements IEmployeeDao, IDao {

    /**
     * Get an employee by id.
     * 
     * @param id of the employee to get.
     * @param options can specify query options like attributes to SELECT.
     * 
     * @returns the employee that was found (or null).
     */
    public findById = async (id: number, options?: QueryOptions): Bluebird<Employee> => {
        const row: any = await db.EmployeeSchema.findById(id, {
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(row)) return null;

        return new Employee(
            row.id,
            row.firstname,
            row.lastname
        );
    };

    /**
     * Get all employees and map to model.
     * 
     * @param options can specify query options like WHERE criteria and attributes to SELECT.
     * 
     * @returns all of the employees that match the query criteria.
     */
    public findAll = async (options?: QueryOptions): Bluebird<Employee[]> => {
        const rows: any = await db.EmployeeSchema.findAll({
            where: options.where,
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(rows)) return null;

        const employees = rows.map((row: any) => {
            return new Employee(
                row.id,
                row.firstname, 
                row.lastname
            );
        });

        return employees;
    };

    public findOne(options?: QueryOptions): Bluebird<Employee>{
        throw Error('Not implemented.');
    };

    /**
     * Create an employee.
     * 
     * @param record model of the employee to create.
     * 
     * @returns the newly created, or null.
     */
    public create = async (record: Employee): Bluebird<Employee> => {
        const { firstname, lastname } = record;
        const error = isNil(firstname) || isNil(lastname);
        if(error) throw Error(`Can't create employee. Missing information. ${record}.`);

        const result: any = await db.EmployeeSchema.create({ firstname, lastname });

        if(isNil(result.id)) return null;

        return new Employee(result.id, result.firstname, result.lastname);
    };

    /**
     * Remove an employee entry from our db. 
     * 
     * @param id Identifier for the entry to delete.
     * 
     * @returns whether or not the entry was deleted.
     */
    public destroy = async (id: number): Bluebird<boolean> => {
        const deleted = await db.EmployeeSchema.destroy({ where: { id: id }})
            .catch((e) => { console.error(e); });

        return deleted === 1;
    };
};

export default EmployeeDao;