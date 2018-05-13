import { IEmployeeService } from '../../business/services/payroll/employee.service';
import Employee from '../../business/contracts/payroll/employee';
import EmployeeVM from '../models/payroll/employee.viewmodel';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';

// My own little twist to add DI and make resolvers more testable. Resolver is basically a controller.
const queryResolver = (employeeService: IEmployeeService): any => {

    const getEmployees = async (): Bluebird<EmployeeVM[]> => { 
        const employees: Employee[] = await employeeService.getEmployees(); 
    
        return employees.map((employee: Employee) => {
            return employee.toViewModel();
        });
    };

    const getEmployee = async (root, args): Bluebird<EmployeeVM> => { 
        if(isNil(args.id) || args.id < 0) throw Error('Pleaes provid a valid id to get the employee.');

        const employee: Employee = await employeeService.getEmployee(args.id); 

        if(isNull(employee)) throw Error(`Could not find employee with id ${args.id}.`);

        return employee.toViewModel();
    }

    return {
        Query: {
            employees: getEmployees,
            employee: getEmployee
        },
    };

}

export default queryResolver;