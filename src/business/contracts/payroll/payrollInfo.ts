export default class PayrollInfo {
    constructor(employeeId?: number, salary?: number, paychecksPerYear?: number, benefitsPackageId?: number) {
        this.employeeId = employeeId;
        this.salary = salary;
        this.paychecksPerYear = paychecksPerYear;
        this.benefitsPackageId = benefitsPackageId;
    }

    public employeeId: number;
    public salary: number;
    public paychecksPerYear: number; 
    public benefitsPackageId: number;
};