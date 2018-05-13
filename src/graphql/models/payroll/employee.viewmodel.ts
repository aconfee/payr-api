export default class EmployeeVM {
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
};