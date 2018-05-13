import IDataModel from '../IDataModel.datamodel';
import IContract from '../../../business/contracts/payroll/payrollInfo';
import PayrollInfo from '../../../business/contracts/payroll/payrollInfo';

export default class PayrollInfoDM implements IDataModel {
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

    public toContract(): PayrollInfo {
        return new PayrollInfo(
            this.employeeId,
            this.salary,
            this.paychecksPerYear,
            this.benefitsPackageId
        );
    };
};