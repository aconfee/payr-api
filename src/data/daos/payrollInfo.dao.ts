import db from '../index';
import Bluebird from 'bluebird';
import PayrollInfo from '../../services/models/payrollInfo.model';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IPayrollInfoDao {
    findOneByEmployeeId(employeeId: number, attributes: string[]): Bluebird<PayrollInfo>
    create(salary: number, employeeId: number, benefitsPackageId: number): Bluebird<PayrollInfo>
};

class PayrollInfoDao implements IPayrollInfoDao {

    /**
     * TODO: This is a bit lazy. In real life, I'd make my own query objects that could be used from the 
     * services/biz layer instead of making a method for every case I have. On the other hand... this does 
     * allow me to more tightly control what functionality is exposed / needed by the application, and no more.
     * Keeps people from shooting themselves in the foot, or doing things that shouldn't be possible. 
     * 
     * Get the payroll information for the provided employee.
     */
    public findOneByEmployeeId = async (employeeId: number, attributes: string[]): Bluebird<PayrollInfo> => {
        const payrollInfoRow: any = await db.PayrollInfoSchema.findOne({ 
            where: {employeeId: employeeId },
            attributes: attributes
        })
        .catch((e) => { console.error(e); });

        if(isNull(payrollInfoRow) || isUndefined(payrollInfoRow)){
            return null;
        }

        return new PayrollInfo(
            payrollInfoRow.salary, 
            payrollInfoRow.paychecksPerYear,
            payrollInfoRow.benefitsPackageId
        );
    };

    public create = async (salary: number, employeeId: number, benefitsPackageId: number): Bluebird<PayrollInfo> => {
        const result: any = await db.PayrollInfoSchema.create({ salary, employeeId, benefitsPackageId: benefitsPackageId });

        if(isNull(result.id) || isUndefined(result.id)) return null;

        return new PayrollInfo(result.salary, result.paychecksPerYear);
    };
};

export default PayrollInfoDao;