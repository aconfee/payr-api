import db from '../index';
import Bluebird from 'bluebird';
import IDao, { QueryOptions } from './IDao.dao';
import PayrollInfo from '../../services/models/payrollInfo.model';
import isNil from 'lodash/isNil';

export interface IPayrollInfoDao {
    findOne(options?: QueryOptions): Bluebird<PayrollInfo>;
    create(record: PayrollInfo): Bluebird<PayrollInfo>;
};

class PayrollInfoDao implements IPayrollInfoDao, IDao {

    public findById(id: number, options?: QueryOptions): Bluebird<PayrollInfo>{
        throw Error('Not implemented.');
    }; 

    public findAll(options?: QueryOptions): Bluebird<PayrollInfo[]>{
        throw Error('Not implemented.');
    };

    /** 
     * Get the payroll information for the provided employee.
     *
     * @param options can specify query options like WHERE criteria and attributes to SELECT.
     * 
     * @returns one payroll info that match the query criteria.
     */
    public findOne = async (options?: QueryOptions): Bluebird<PayrollInfo> => {
        const payrollInfoRow: any = await db.PayrollInfoSchema.findOne({ 
            where: options.where,
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(payrollInfoRow)) return null;

        return new PayrollInfo(
            payrollInfoRow.employeeId,
            payrollInfoRow.salary, 
            payrollInfoRow.paychecksPerYear,
            payrollInfoRow.benefitsPackageId
        );
    };

    /**
     * Create a payroll info.
     * 
     * @param record model of the payroll info to create.
     * 
     * @returns the newly created, or null.
     */
    public create = async (record: PayrollInfo): Bluebird<PayrollInfo> => {
        const { employeeId, benefitsPackageId, salary } = record;
        const error = isNil(employeeId) || isNil(salary);
        if(error) throw Error(`Can't create payroll info. Missing information. ${record}.`);

        const result: any = await db.PayrollInfoSchema.create({ salary, employeeId, benefitsPackageId: benefitsPackageId });

        if(isNil(result.id)) return null;

        return new PayrollInfo(result.salary, result.paychecksPerYear);
    };

    public destroy(id: number): Bluebird<boolean> {
        throw Error('Not implemented.');
    };
};

export default PayrollInfoDao;