import IViewModel from '../IViewModel.viewmodel';
import Dependent from '../../../business/contracts/benefits/dependent'

export default class DependentVM implements IViewModel {
    constructor(
        id?: number, 
        employeeId?: number,
        firstname?: string, 
        lastname?: string
    ) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstname = firstname;
        this.lastname = lastname;
    };

    public id: number;
    public employeeId: number;
    public firstname: string;
    public lastname: string; 

    public toContract(): Dependent {
        return new Dependent(
            this.id,
            this.employeeId,
            this.firstname,
            this.lastname
        );
    };
};