import { IEmployeeDao } from '../data/daos/employee.dao';
import { IPayrollInfoDao } from '../data/daos/payrollInfo.dao';
import { QueryOptions } from '../data/daos/IDao.dao';
import Employee from './models/employee.model';
import PayrollInfo from './models/payrollInfo.model';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import isNil from 'lodash/isNil';

export interface IEmployeeService {
    getEmployees(): Bluebird<Employee[]>;
    getEmployeePayrollInfo(employeeId: number): Bluebird<PayrollInfo>;
    addEmployee(firstname: string, lastname: string): Bluebird<Employee>;
    removeEmployee(id: number): Bluebird<boolean>;
    getEmployee(id: number): Bluebird<Employee>;
};

class EmployeeService implements IEmployeeService {

    private employeeDao: IEmployeeDao = null;
    private payrollInfoDao: IPayrollInfoDao = null;

    constructor(
        employeeDao: IEmployeeDao,
        payrollInfoDao: IPayrollInfoDao,
    ) {
        this.employeeDao = employeeDao;
        this.payrollInfoDao = payrollInfoDao;
    };

    /**
     * TODO: Add paging and other filters.
     * 
     * Get all employees in the DB.
     * 
     * @returns All employees in the DB 
     */
    public getEmployees = (): Bluebird<Employee[]> => {
        return this.employeeDao.findAll(new QueryOptions(null, ['id', 'firstname', 'lastname']));
    };

    /**
     * Get an employee by id.
     * 
     * @param id of the employee to get.
     * 
     * @returns The employee corresponding to the provided id.
     */
    public getEmployee = (id: number): Bluebird<Employee> => {
        return this.employeeDao.findById(
            id,
            new QueryOptions(null, ['id', 'firstname', 'lastname'])
        );
    };

    /**
     * Get the payroll information for an employee with the provided Id. 
     * 
     * @param employeeId The id of the employee whose payroll information we want. 
     * 
     * @returns The payroll info associated with the provided employee. 
     */
    public getEmployeePayrollInfo = async (employeeId: number): Bluebird<PayrollInfo> => {
        const payrollInfo = await this.payrollInfoDao.findOne(
            new QueryOptions({ employeeId }, ['salary', 'paychecksPerYear'])
        );

        if(isNil(payrollInfo)) throw Error(`Could not find payroll info for employee with id ${employeeId}.`);

        return payrollInfo;
    };

    /**
     * Add an employee to our DB
     * 
     * @param firstname The first name of the employee to create
     * @param lastname The last name of the employee to create
     * 
     * @returns A promise for the newly created object.
     */
    public addEmployee = async (firstname: string, lastname: string): Bluebird<Employee> => {
        const newEmployee: any = await this.employeeDao.create(new Employee(null, firstname.trim(), lastname.trim()));

        if(isNil(newEmployee)) throw Error(`Could not create or find employee ${firstname} ${lastname}.`);

        // In this contrived example, all employees have the same salary and benefits package. But this is easily changeable. 
        const newPayrollInfo = await this.payrollInfoDao.create(new PayrollInfo(newEmployee.id, 52000, 26, 1));

        if(isNil(newPayrollInfo))
        { 
            this.employeeDao.destroy(newEmployee.id);
            throw Error(`Could not create payroll info during creation of employee ${newEmployee}. Rolling back employee creation.`);
        }

        return newEmployee;
    };

    /**
     * Remove an employee from our DB
     * 
     * @param id The id of the employee to remove. 
     * 
     * @returns true if the employee and its related table columns are successfully destroyed.
     */
    public removeEmployee = async (id: number): Bluebird<boolean> => {
        const deleted: boolean = await this.employeeDao.destroy(id);

        if(!deleted) throw Error(`Could not delete employee with id: ${id}.`);

        return deleted;
    };

};

export default EmployeeService;