import Employee from './models/employee.model';
import PayrollInfo from './models/payrollInfo.model';
import EmployeeDao from '../data/employee.dao';
import PayrollInfoDao from '../data/payrollInfo.dao';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import Sequelize from 'sequelize';
import _ from 'lodash';


export interface IEmployeeService {
    getEmployees(): Bluebird<void | Employee[]>;
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
     * Get all employees in the DB.
     */
    public getEmployees = async (): Bluebird<void | Employee[]> => {
        const employeeRows: any = await this.employeeDao.findAll()
            .catch((e) => { console.error(e); });

        if(_.isNull(employeeRows) || _.isUndefined(employeeRows)){
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
     */
    public getEmployeePayrollInfo = async (employeeId: number): Bluebird<PayrollInfo> => {
        const payrollInfoRow: any = await this.payrollInfoDao.findOne({ where: {employeeId: employeeId }})
            .catch((e) => { console.error(e); });

        if(_.isNull(payrollInfoRow) || _.isUndefined(payrollInfoRow)){
            return null;
        }

        return new PayrollInfo(payrollInfoRow.get('salary'), payrollInfoRow.get('paychecksPerYear'));
    };

};

export default EmployeeService;