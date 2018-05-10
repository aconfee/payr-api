import { IEmployeeService } from '../../services/employee.service';

// My own little twist to add DI and make resolvers more testable.
const queryResolver = (employeeService: IEmployeeService): any => {

    return {
        Query: {
            employees: (): any => { return employeeService.getEmployees(); }
        },
    };

}

export default queryResolver;