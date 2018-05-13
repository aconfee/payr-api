import { IEmployeeService } from '../../business/services/payroll/employee.service';
import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import Employee from '../../business/contracts/payroll/employee';
import Dependent from '../../business/contracts/benefits/dependent';
import isNull from 'lodash/isNull';

const mutationResolver = (employeeService: IEmployeeService, benefitsService: IBenefitsService): any => {

    const addEmployee = async (root, args) => { 
        const employee: Employee = await employeeService.addEmployee(args.firstname, args.lastname); 

        if(isNull(employee)) throw Error(`Failed to add employee ${args.firstname} ${args.lastname}.`);
    };

    const removeEmployee = async (root, args) => { 
        const result: boolean = await employeeService.removeEmployee(args.id); 

        if(!result) throw Error(`Failed to remove employee with id ${args.id}.`);
    };

    const addDependent = async (root, args) => { 
        const dependent: Dependent = await benefitsService.addEmployeeDependent(args.employeeId, args.firstname, args.lastname); 

        if(isNull(dependent)) throw Error(`Failed to add dependent ${args.firstname} ${args.lastname}.`);
    };

    const removeDependent = async (root, args) => { 
        const result: boolean = await benefitsService.removeEmployeeDependent(args.id); 

        if(!result) throw Error(`Failed to remove dependent with id ${args.id}.`);
    };

    return {
        Mutation: {
            addEmployee: addEmployee,
            removeEmployee: removeEmployee,
            addDependent: addDependent,
            removeDependent: removeDependent
        }
    };

}

export default mutationResolver;