import IContract from '../IContract';
import EmployeeDM from '../../../data/models/payroll/employee.datamodel';
import EmployeeVM from '../../../graphql/models/payroll/employee.viewmodel';
import IViewModel from '../../../graphql/models/IViewModel.viewmodel';

export default class Employee implements IContract {
    constructor(id?: number, firstname?: string, lastname?: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public id: number;
    public firstname: string;
    public lastname: string; 

    public toDataModel(): EmployeeDM {
        return new EmployeeDM(
            this.id,
            this.firstname,
            this.lastname,
            null,
            null
        );
    };

    public toViewModel(): EmployeeVM {
        return new EmployeeVM(
            this.id,
            this.firstname,
            this.lastname            
        );
    };
};