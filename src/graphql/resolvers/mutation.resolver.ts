import { IEmployeeService } from '../../services/employee.service';

const mutationResolver = (employeeService: IEmployeeService): any => {

    return {
        Mutation: {
            addEmployee: (root, args) => { return employeeService.addEmployee(args.firstname, args.lastname); },
            removeEmployee: (root, args) => { return employeeService.removeEmployee(args.id); }
        }
    };

}

export default mutationResolver;