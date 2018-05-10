import Employee from './models/employee.model';
import PayrollInfo from './models/payrollInfo.model';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import Sequelize from 'sequelize';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IEmployeeService {
    getEmployees(): Bluebird<void | Employee[]>;
    getEmployeePayrollInfo(employeeId: number): Bluebird<PayrollInfo>;
    addEmployee(firstname: string, lastname: string): Bluebird<{}>;
    removeEmployee(id: number): Bluebird<{}>;
};

class EmployeeService implements IEmployeeService {

    private employeeDao: Sequelize.Model<{}, {}> = null;
    private payrollInfoDao: Sequelize.Model<{}, {}> = null;

    constructor(
        employeeDao: Sequelize.Model<{}, {}>,
        payrollInfoDao: Sequelize.Model<{}, {}>
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
    public getEmployees = async (): Bluebird<void | Employee[]> => {
        const employeeRows: any = await this.employeeDao.findAll()
            .catch((e) => { console.error(e); });

        if(isNull(employeeRows) || isUndefined(employeeRows)){
            return null;
        }

        const employees = employeeRows.map((employeeRow) => {
            return new Employee(
                employeeRow.get('id'),
                employeeRow.get('firstname'), 
                employeeRow.get('lastname')
            );
        });

        return employees;
    };

    /**
     * Get the payroll information for an employee with the provided Id. 
     * 
     * @param employeeId The id of the employee whose payroll information we want. 
     * 
     * @returns The payroll info associated with the provided employee. 
     */
    public getEmployeePayrollInfo = async (employeeId: number): Bluebird<PayrollInfo> => {
        const payrollInfoRow: any = await this.payrollInfoDao.findOne({ where: {employeeId: employeeId }})
            .catch((e) => { console.error(e); });

        if(isNull(payrollInfoRow) || isUndefined(payrollInfoRow)){
            return null;
        }

        return new PayrollInfo(
            payrollInfoRow.get('salary'), 
            payrollInfoRow.get('paychecksPerYear')
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
    public addEmployee = async (firstname: string, lastname: string): Bluebird<{}> => {
        const newEmployee: any = await this.employeeDao.create({
            firstname: firstname,
            lastname: lastname
        }).catch((e) => { console.error(e); });

        // In this contrived example, all employees have the same salary and benefits package. But this is easily extensible. 
        this.payrollInfoDao.create({
            salary: 52000,
            benefitsPackageId: 1,
            employeeId: newEmployee.id
        });

        return newEmployee;
    };

    /**
     * Remove an employee from our DB
     * 
     * @param id The id of the employee to remove. 
     * 
     * @returns true if the employee and its related table columns are successfully destroyed.
     */
    public removeEmployee = async (id: number): Bluebird<{}> => {
        const employeeDeleteResult: any = await this.employeeDao.destroy({ where: { id: id }})
            .catch((e) => { console.error(e); });

        const payrollDeleteResult: any = await this.payrollInfoDao.destroy({ where: { employeeId: id }})
            .catch((e) => { console.error(e); });

        if(employeeDeleteResult + payrollDeleteResult !== 2) return false;

        return true;
    };

};

export default EmployeeService;