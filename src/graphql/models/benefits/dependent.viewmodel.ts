export default class DependentVM {
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
};