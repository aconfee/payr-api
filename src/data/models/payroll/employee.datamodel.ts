import IDataModel from '../IDataModel.datamodel';
import Employee from '../../../business/contracts/payroll/employee';

export default class EmployeeDM implements IDataModel {
    constructor(
        id?: number, 
        firstname?: string, 
        lastname?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    public id: number;
    public firstname: string;
    public lastname: string; 
    public createdAt: Date;
    public updatedAt: Date;

    public toContract(): Employee {
        return new Employee(
            this.id,
            this.firstname,
            this.lastname
        );
    };
};