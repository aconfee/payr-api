import IContract from '../IContract';
import PayrollInfoVM from '../../../graphql/models/payroll/payrollInfo.viewmodel';
import PayrollInfoDM from '../../../data/models/payroll/payrollInfo.datamodel';

export default class PayrollInfo implements IContract {
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

    public toDataModel(): PayrollInfoDM {
        return new PayrollInfoDM(
            null,
            this.employeeId,
            this.salary,
            this.paychecksPerYear,
            this.benefitsPackageId,
            null,
            null
        );
    };

    public toViewModel(): PayrollInfoVM {
        return new PayrollInfoVM(
            this.salary,
            this.paychecksPerYear,
            this.benefitsPackageId
        );
    };
};