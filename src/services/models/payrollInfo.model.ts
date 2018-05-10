class PayrollInfo {
    constructor(salary?: number, paychecksPerYear?: number) {
        this.salary = salary;
        this.paychecksPerYear = paychecksPerYear;
    }

    public salary: number;
    public paychecksPerYear: number; 
}

export default PayrollInfo;