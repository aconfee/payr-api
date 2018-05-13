export default class EmployeeDM {
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
};