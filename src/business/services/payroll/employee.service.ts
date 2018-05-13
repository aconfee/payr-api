import { IEmployeeDao } from '../../../data/daos/payroll/employee.dao';
import { IPayrollInfoDao } from '../../../data/daos/payroll/payrollInfo.dao';
import { QueryOptions } from '../../../data/daos/IDao.dao';
import EmployeeDM from '../../../data/models/payroll/employee.datamodel'
import Employee from '../../contracts/payroll/employee';
import PayrollInfoDM from '../../../data/models/payroll/payrollInfo.datamodel';
import PayrollInfo from '../../contracts/payroll/payrollInfo';
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
    public getEmployees = async (): Bluebird<Employee[]> => {
        const employees: EmployeeDM[] = await this.employeeDao.findAll(new QueryOptions(null, ['id', 'firstname', 'lastname']));

        if(isNil(employees)) return [];
        
        return employees.map((employee: EmployeeDM) => {
            return new Employee(
                employee.id,
                employee.firstname,
                employee.lastname
            )
        });
    };

    /**
     * Get an employee by id.
     * 
     * @param id of the employee to get.
     * 
     * @returns The employee corresponding to the provided id.
     */
    public getEmployee = async (id: number): Bluebird<Employee> => {
        const employee: EmployeeDM = await this.employeeDao.findById(
            id,
            new QueryOptions(null, ['id', 'firstname', 'lastname'])
        );

        if(isNil(employee)) return null;

        return new Employee(
            employee.id,
            employee.firstname,
            employee.lastname
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
        const payrollInfo: PayrollInfoDM = await this.payrollInfoDao.findOne(
            new QueryOptions({ employeeId }, ['salary', 'paychecksPerYear'])
        );

        if(isNil(payrollInfo)) return null;

        return new PayrollInfo(
            payrollInfo.employeeId,
            payrollInfo.salary,
            payrollInfo.paychecksPerYear,
            payrollInfo.benefitsPackageId
        );
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
        const newEmployee: EmployeeDM = await this.employeeDao.create(new EmployeeDM(null, firstname.trim(), lastname.trim()));

        if(isNil(newEmployee)) return null;

        // In this contrived example, all employees have the same salary and benefits package. But this is easily changeable. 
        const newPayrollInfo: PayrollInfoDM = await this.payrollInfoDao.create(new PayrollInfoDM(null, newEmployee.id, 52000, 26, 1));

        if(isNil(newPayrollInfo))
        { 
            this.employeeDao.destroy(newEmployee.id);
            throw Error(`Could not create payroll info during creation of employee ${newEmployee}. Rolling back employee creation.`);
        }

        return new Employee(
            newEmployee.id,
            newEmployee.firstname,
            newEmployee.lastname
        );
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

        return deleted;
    };

};

export default EmployeeService;