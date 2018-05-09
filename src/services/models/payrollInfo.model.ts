class PayrollInfo {
    constructor(salary?: number, paychecksPerYear?: number, benefitsPackageId?: number) {
        this.salary = salary;
        this.paychecksPerYear = paychecksPerYear;
        this.benefitsPackageId = benefitsPackageId;
    }

    public salary: number;
    public paychecksPerYear: number; 
    public benefitsPackageId: number;
}

export default PayrollInfo;