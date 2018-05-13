import Dependent from '../../contracts/benefits/dependent';
import BenefitsPackage from '../../contracts/benefits/benefitsPackage';
import Employee from '../../contracts/payroll/employee';
import DependentDM from '../../../data/models/benefits/dependent.datamodel';
import BenefitsPackageDM from '../../../data/models/benefits/benefitsPackage.datamodel';
import EmployeeDM from '../../../data/models/payroll/employee.datamodel';
import PayrollInfoDM from '../../../data/models/payroll/payrollInfo.datamodel';
import Bluebird from 'bluebird'; 
import { IDiscountsService } from './discounts.service';
import { IPayrollInfoDao } from '../../../data/daos/payroll/payrollInfo.dao';
import { IBenefitsPackageDao } from '../../../data/daos/benefits/benefitsPackage.dao';
import { IDependentDao } from '../../../data/daos/benefits/dependent.dao';
import { QueryOptions } from '../../../data/daos/IDao.dao';
import isNil from 'lodash/isNull';

export interface IBenefitsService {
    getEmployeeDependents(employeeId: number): Bluebird<Dependent[]>;
    getEmployeeBenefitsPackage(employeeId: number): Bluebird<BenefitsPackage>;
    getTotalAnnualCost(employee: Employee): Bluebird<number>;
    addEmployeeDependent(employeeId: number, firstname: string, lastname: string): Bluebird<Dependent>;
    removeEmployeeDependent(id: number): Bluebird<boolean>;
};

class BenefitsService implements IBenefitsService {

    private dependentDao: IDependentDao = null;
    private payrollInfoDao: IPayrollInfoDao = null;
    private benefitsPackageDao: IBenefitsPackageDao = null;
    private discountsService: IDiscountsService = null;

    constructor(
        dependentDao: IDependentDao,
        payrollInfoDao: IPayrollInfoDao,
        benefitsPackageDao: IBenefitsPackageDao,
        discountsService: IDiscountsService
    ) {
        this.dependentDao = dependentDao;
        this.payrollInfoDao = payrollInfoDao;
        this.benefitsPackageDao = benefitsPackageDao;
        this.discountsService = discountsService;
    };

    /**
     * Get the dependents for the provided employee id.
     * 
     * @param employeeId The employee whose dependents we will retrieve.
     * 
     * @returns A list of dependents belonging to the employee with the provided id. 
     */
    public getEmployeeDependents = async (employeeId: number): Bluebird<Dependent[]> => {
        const dependents: DependentDM[] = await this.dependentDao.findAll(new QueryOptions(
            { employeeId: employeeId }, 
            ['id', 'firstname', 'lastname'])
        );

        if(isNil(dependents)) return [];

        return dependents.map((dependent: DependentDM) => {
            return new Dependent(
                dependent.id,
                dependent.employeeId,
                dependent.firstname,
                dependent.lastname
            );
        });
    };

    /**
     * Add a dependent for an employee.
     * 
     * @param employeeId The employee whose dependents we will retrieve.
     * @param firstname of the dependent.
     * @param lastname of the dependent.
     * 
     * @returns The newly created dependent.
     */
    public addEmployeeDependent = async (employeeId: number, firstname: string, lastname: string): Bluebird<Dependent> => {
        const newDependent: DependentDM = await this.dependentDao.create(
            new DependentDM(null, employeeId, firstname.trim(), lastname.trim())
        );

        if(isNil(newDependent)) return null;

        return new Dependent(
            newDependent.id,
            newDependent.employeeId,
            newDependent.firstname,
            newDependent.lastname
        );
    };

    /**
     * Remove a dependent.
     * 
     * @param id of the dependent to remove.
     * 
     * @returns whether or not the record was successfully removed.
     */
    public removeEmployeeDependent = async (id: number): Bluebird<boolean> => {
         const deleted: boolean = await this.dependentDao.destroy(id);

        return deleted;
    };

    /**
     * Get the benefits package that the provided employee is enroleld in.
     * 
     * @param employeeId The employee whose benefits package we will retrieve.
     * 
     * @returns The benefits package that the employee with the provided id is enrolled in.
     */
    public getEmployeeBenefitsPackage = async (employeeId: number): Bluebird<BenefitsPackage> => {
        const payrollInfo: PayrollInfoDM = await this.payrollInfoDao.findOne(
            new QueryOptions({ employeeId }, ['benefitsPackageId'])
        );

        if(isNil(payrollInfo)) throw Error(`Could not find payroll info for employee with id ${employeeId}. Therefore can't find benefits package.`);

        const benefitsPackage: BenefitsPackageDM = await this.benefitsPackageDao.findById(
            payrollInfo.benefitsPackageId,
            new QueryOptions(null, ['name', 'baseCost', 'dependentCost'])
        );

        if(isNil(benefitsPackage)) return null;

        return new BenefitsPackage(
            benefitsPackage.name,
            benefitsPackage.baseCost,
            benefitsPackage.dependentCost
        );
    };

    /**
     * Gets the total, final annual cost of benefits for an employee. Considers dependents
     * and discounts.
     * 
     * @param employee The employee whose total benefits cost we will calculate.
     * 
     * @returns A final calculation of the total annual cost of benefits for the provided employee.
     */
    public getTotalAnnualCost = async (employee: Employee): Bluebird<number> => {
        const benefitsPackage: BenefitsPackage = await this.getEmployeeBenefitsPackage(employee.id);

        if(isNil(benefitsPackage)) {
            console.error(`Could not find benefits package for employee ${employee}.`);
            return null;
        }

        const baseCost: number = this.discountsService.applyBenefitsDiscounts(employee, benefitsPackage.baseCost);
        const dependents: Dependent[] = await this.getEmployeeDependents(employee.id);
            
        let dependentsCost = 0.0;
        dependents.forEach((dependent: Dependent) => {
            dependentsCost += this.discountsService.applyBenefitsDiscounts(dependent, benefitsPackage.dependentCost);
        });

        return baseCost + dependentsCost;
    };

};

export default BenefitsService;