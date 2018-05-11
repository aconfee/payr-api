import { IEmployeeService } from '../../services/employee.service';
import { IBenefitsService } from '../../services/benefits.service';

const mutationResolver = (employeeService: IEmployeeService, benefitsService: IBenefitsService): any => {

    return {
        Mutation: {
            addEmployee: (root, args) => { return employeeService.addEmployee(args.firstname, args.lastname); },
            removeEmployee: (root, args) => { return employeeService.removeEmployee(args.id); },
            addDependent: (root, args) => { return benefitsService.addEmployeeDependent(args.employeeId, args.firstname, args.lastname); },
            removeDependent: (root, args) => { return benefitsService.removeEmployeeDependent(args.id); }
        }
    };

}

export default mutationResolver;