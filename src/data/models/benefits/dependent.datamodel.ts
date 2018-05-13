import IDataModel from '../IDataModel.datamodel';
import Dependent from '../../../business/contracts/benefits/dependent';

export default class DependentDM implements IDataModel {
    constructor(
        id?: number, 
        employeeId?: number, 
        firstname?: string, 
        lastname?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    public id: number;
    public employeeId: number;
    public firstname: string;
    public lastname: string; 
    public createdAt: Date;
    public updatedAt: Date;

    public toContract(): Dependent {
        return new Dependent(
            this.id,
            this.employeeId,
            this.firstname,
            this.lastname
        );
    };
};