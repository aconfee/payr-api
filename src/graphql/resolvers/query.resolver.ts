import { IEmployeeService } from '../../business/services/payroll/employee.service';
import Employee from '../../business/contracts/payroll/employee';
import EmployeeVM from '../models/payroll/employee.viewmodel';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';

// My own little twist to add DI and make resolvers more testable. Resolver is basically a controller.
const queryResolver = (employeeService: IEmployeeService): any => {

    const getEmployees = async (): Bluebird<EmployeeVM[]> => { 
        const employees: Employee[] = await employeeService.getEmployees(); 
    
        return employees.map((employee: Employee) => {
            return new EmployeeVM(
                employee.id,
                employee.firstname,
                employee.lastname
            );
        });
    };

    const getEmployee = async (root, args): Bluebird<EmployeeVM> => { 
        const employee: Employee = await employeeService.getEmployee(args.id); 

        if(isNull(employee)) throw Error(`Could not find employee with id ${args.id}.`);

        return new Employee(
            employee.id,
            employee.firstname,
            employee.lastname
        );
    };

    return {
        Query: {
            employees: getEmployees,
            employee: getEmployee
        },
    };

}

export default queryResolver;