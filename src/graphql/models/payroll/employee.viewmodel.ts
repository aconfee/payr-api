import IViewModel from '../IViewModel.viewmodel';
import Employee from '../../../business/contracts/payroll/employee';

export default class EmployeeVM implements IViewModel {
    constructor(
        id?: number, 
        firstname?: string, 
        lastname?: string
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    };

    public id: number;
    public firstname: string;
    public lastname: string; 

    public toContract(): Employee {
        return new Employee(
            this.id,
            this.firstname,
            this.lastname
        );
    };
};