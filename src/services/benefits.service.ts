import Dependent from './models/dependent.model';
import Employee from './models/employee.model';
import BenefitsPackage from './models/benefitsPackage.model';
import Bluebird from 'bluebird'; 
import { IDiscountsService } from './discounts.service';
import { IPayrollInfoDao } from '../data/daos/payrollInfo.dao';
import { IBenefitsPackageDao } from '../data/daos/benefitsPackage.dao';
import { IDependentDao } from '../data/daos/dependent.dao';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';


export interface IBenefitsService {
    getEmployeeDependents(employeeId: number): Bluebird<void | Dependent[]>;
    getEmployeeBenefitsPackage(employeeId: number): Bluebird<void | BenefitsPackage>;
    getTotalAnnualCost(employee: Employee): Promise<number>;
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
        return this.dependentDao.findAllByEmployeeId(employeeId, ['id', 'firstname', 'lastname']);
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
        const newDependent = await this.dependentDao.create(employeeId, firstname, lastname);

        if(isNull(newDependent)) throw Error(`Could not create or dependent ${firstname} ${lastname}.`);

        return newDependent;
    };

    /**
     * Remove a dependent.
     * 
     * @param id of the dependent to remove.
     * 
     * @returns whether or not the record was successfully removed.
     */
    public removeEmployeeDependent = async (id: number): Bluebird<boolean> => {
         const deleted: boolean = await this.dependentDao.destroyById(id);

        if(!deleted) throw Error(`Could not delete dependent with id: ${id}.`);

        return deleted;
    };

    /**
     * Get the benefits package that the provided employee is enroleld in.
     * 
     * @param employeeId The employee whose benefits package we will retrieve.
     * 
     * @returns The benefits package that the employee with the provided id is enrolled in.
     */
    public getEmployeeBenefitsPackage = async(employeeId: number): Bluebird<void | BenefitsPackage> => {
        const payrollInfo = await this.payrollInfoDao.findOneByEmployeeId(employeeId, ['benefitsPackageId']);

        if(isNull(payrollInfo)) throw Error(`Could not find payroll info for employee with id ${employeeId}.`);

        return this.benefitsPackageDao.findOneById(payrollInfo.benefitsPackageId, ['name', 'baseCost', 'dependentCost']);
    };

    /**
     * Gets the total, final annual cost of benefits for an employee. Considers dependents
     * and discounts.
     * 
     * @param employee The employee whose total benefits cost we will calculate.
     * 
     * @returns A final calculation of the total annual cost of benefits for the provided employee.
     */
    public getTotalAnnualCost = async (employee: Employee): Promise<number> => {
        const benefitsPackage: any = await this.getEmployeeBenefitsPackage(employee.id)
            .catch((e) => { console.error(e); });

        const baseCost = this.discountsService.applyBenefitsDiscounts(employee, benefitsPackage.baseCost);

        const dependents: any = await this.getEmployeeDependents(employee.id)
            .catch((e) => { console.error(e); });
            
        var dependentsCost = 0.0;
        dependents.forEach((dependent) => {
            dependentsCost += this.discountsService.applyBenefitsDiscounts(dependent, benefitsPackage.dependentCost);
        });

        return baseCost + dependentsCost;
    };

};

export default BenefitsService;