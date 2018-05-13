import { IEmployeeService } from '../../business/services/payroll/employee.service';
import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import Employee from '../../business/contracts/payroll/employee';
import Dependent from '../../business/contracts/benefits/dependent';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';

const mutationResolver = (employeeService: IEmployeeService, benefitsService: IBenefitsService): any => {

    const addEmployee = async (root, args) => { 
        if(isNil(args.firstname) || args.firstname.trim().length <= 0) throw Error('Please provide a valid firstname to add an employee.');
        if(isNil(args.lastname) || args.lastname.trim().length <= 0) throw Error('Please provide a valid lastname to add an employee.');

        const employee: Employee = await employeeService.addEmployee(args.firstname.trim(), args.lastname.trim()); 

        if(isNull(employee)) throw Error(`Failed to add employee ${args.firstname} ${args.lastname}.`);
    };

    const removeEmployee = async (root, args) => { 
        if(isNil(args.id) || args.id < 0) throw Error('Please provide a valid id to remove an employee.');

        const result: boolean = await employeeService.removeEmployee(args.id); 

        if(!result) throw Error(`Failed to remove employee with id ${args.id}.`);
    };

    const addDependent = async (root, args) => { 
        if(isNil(args.employeeId) || args.employeeId < 0) throw Error('Please provide a valid employeeId to add a dependent.');
        if(isNil(args.firstname) || args.firstname.trim().length <= 0) throw Error('Please provide a valid firstname to create a dependent.');
        if(isNil(args.lastname) || args.lastname.trim().length <= 0) throw Error('Please provide a valid lastname to create a dependent.');

        const dependent: Dependent = await benefitsService.addEmployeeDependent(args.employeeId, args.firstname.trim(), args.lastname.trim()); 

        if(isNull(dependent)) throw Error(`Failed to add dependent ${args.firstname} ${args.lastname}.`);
    };

    const removeDependent = async (root, args) => { 
        if(isNil(args.id) || args.id < 0) throw Error('Please provide a valid id to remove a dependent.');
        
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