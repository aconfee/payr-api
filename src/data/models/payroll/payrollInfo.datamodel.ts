export default class PayrollInfoDM {
    constructor(
        id?: number,
        employeeId?: number, 
        salary?: number, 
        paychecksPerYear?: number, 
        benefitsPackageId?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.employeeId = employeeId;
        this.salary = salary;
        this.paychecksPerYear = paychecksPerYear;
        this.benefitsPackageId = benefitsPackageId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    public id: number;
    public employeeId: number;
    public salary: number;
    public paychecksPerYear: number; 
    public benefitsPackageId: number;
    public createdAt: Date;
    public updatedAt: Date;
};