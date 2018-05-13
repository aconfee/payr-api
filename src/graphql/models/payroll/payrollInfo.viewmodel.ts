import IViewModel from '../IViewModel.viewmodel';
import PayrollInfo from '../../../business/contracts/payroll/payrollInfo';

export default class PayrollInfoVM implements IViewModel {
    constructor(
        salary?: number, 
        paychecksPerYear?: number, 
        benefitsPackageId?: number
    ) {
        this.salary = salary;
        this.paychecksPerYear = paychecksPerYear;
        this.benefitsPackageId = benefitsPackageId;
    };

    public salary: number;
    public paychecksPerYear: number; 
    public benefitsPackageId: number;

    public toContract(): PayrollInfo {
        return new PayrollInfo(
            null,
            this.salary,
            this.paychecksPerYear,
            this.benefitsPackageId
        );
    };
};