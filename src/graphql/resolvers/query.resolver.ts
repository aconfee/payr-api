import { IEmployeeService } from '../../services/employee.service';

// My own little twist to add DI and make resolvers more testable.
const queryResolver = (employeeService: IEmployeeService): any => {

    return {
        Query: {
            employees: (): any => { return employeeService.getEmployees(); },
            employee: (root, args): any => { return employeeService.getEmployee(args.id); }
        },
    };

}

export default queryResolver;