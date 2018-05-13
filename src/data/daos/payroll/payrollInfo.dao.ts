import db from '../../index';
import Bluebird from 'bluebird';
import IDao, { QueryOptions } from '../IDao.dao';
import PayrollInfoDM from '../../models/payroll/payrollInfo.datamodel';
import isNil from 'lodash/isNil';

export interface IPayrollInfoDao {
    findOne(options?: QueryOptions): Bluebird<PayrollInfoDM>;
    create(record: PayrollInfoDM): Bluebird<PayrollInfoDM>;
};

class PayrollInfoDao implements IPayrollInfoDao, IDao {

    public findById(id: number, options?: QueryOptions): Bluebird<PayrollInfoDM>{
        throw Error('Not implemented.');
    }; 

    public findAll(options?: QueryOptions): Bluebird<PayrollInfoDM[]>{
        throw Error('Not implemented.');
    };

    /** 
     * Get the payroll information for the provided employee.
     *
     * @param options can specify query options like WHERE criteria and attributes to SELECT.
     * 
     * @returns one payroll info that match the query criteria.
     */
    public findOne = async (options?: QueryOptions): Bluebird<PayrollInfoDM> => {
        const row: any = await db.PayrollInfoSchema.findOne({ 
            where: options.where,
            attributes: options.attributes
        })
        .catch((e) => { console.error(e); });

        if(isNil(row)) return null;

        return new PayrollInfoDM(
            row.id,
            row.employeeId,
            row.salary, 
            row.paychecksPerYear,
            row.benefitsPackageId,
            row.createdAt,
            row.updatedAt
        );
    };

    /**
     * Create a payroll info.
     * 
     * @param record model of the payroll info to create.
     * 
     * @returns the newly created, or null.
     */
    public create = async (record: PayrollInfoDM): Bluebird<PayrollInfoDM> => {
        const { employeeId, benefitsPackageId, salary } = record;
        const error = isNil(employeeId) || isNil(salary);
        if(error) throw Error(`Can't create payroll info. Missing information. ${record}.`);

        const result: any = await db.PayrollInfoSchema.create({ salary, employeeId, benefitsPackageId: benefitsPackageId });

        if(isNil(result.id)) return null;

        return new PayrollInfoDM(
            result.id,
            result.employeeId,
            result.salary, 
            result.paychecksPerYear,
            result.benefitsPackageId,
            result.createdAt,
            result.UpdatedAt
        );
    };

    public destroy(id: number): Bluebird<boolean> {
        throw Error('Not implemented.');
    };
};

export default PayrollInfoDao;