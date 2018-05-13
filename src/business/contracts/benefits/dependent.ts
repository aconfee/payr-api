import IContract from '../IContract';
import DependentDM from '../../../data/models/benefits/dependent.datamodel';
import DependentVM from '../../../graphql/models/benefits/dependent.viewmodel';

export default class Dependent implements IContract {
    constructor(id?: number, employeeId?: number, firstname?: string, lastname?: string) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public id: number;
    public employeeId: number;
    public firstname: string;
    public lastname: string; 

    public toDataModel(): DependentDM {
        return new DependentDM(
            null,
            this.employeeId,
            this.firstname,
            this.lastname,
            null,
            null
        );
    };

    public toViewModel(): DependentVM {
        return new DependentVM(
            this.id,
            this.employeeId,
            this.firstname,
            this.lastname
        );
    };
};