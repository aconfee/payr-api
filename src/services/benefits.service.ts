import Dependent from './models/dependent.model';
import Employee from './models/employee.model';
import BenefitsPackage from './models/benefitsPackage.model';
import BenefitsDiscount from './models/benefitsDiscount.model'
import DependentDao from '../data/dependent.dao';
import BenefitsPackageDao from '../data/benefitsPackage.dao';
import PayrollInfoDao from '../data/payrollInfo.dao';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import _ from 'lodash';
import Sequelize from 'sequelize';
import DiscountsService from './discounts.service';
const Op = Sequelize.Op;


export interface IBenefitsService {
    getEmployeeDependents(employeeId: number): Bluebird<void | Dependent[]>;
    getEmployeeBenefitsPackage(employeeId: number): Bluebird<void | BenefitsPackage>;
    getTotalAnnualCost(employee: Employee): Promise<number>;
};

class BenefitsService implements IBenefitsService {

    private dependentDao: Sequelize.Model<{}, {}> = null;
    private payrollInfoDao: Sequelize.Model<{}, {}> = null;
    private benefitsPackageDao: Sequelize.Model<{}, {}> = null;
    private discountsService: DiscountsService = null;

    constructor(
        dependentDao: Sequelize.Model<{}, {}>,
        payrollInfoDao: Sequelize.Model<{}, {}>,
        benefitsPackageDao: Sequelize.Model<{}, {}>,
        discountsService: DiscountsService
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
        const dependentRows: any = await this.dependentDao.findAll({ where: {employeeId: employeeId }})
            .catch((e) => { console.error(e); });

        if(_.isNull(dependentRows) || _.isUndefined(dependentRows)){
            return null;
        }

        const dependents = dependentRows.map((dependentRow) => {
            return new Dependent(
                dependentRow.get('id'),
                dependentRow.get('firstname'), 
                dependentRow.get('lastname')
            );
        });

        return dependents;
    };

    /**
     * Get the benefits package that the provided employee is enroleld in.
     * 
     * @param employeeId The employee whose benefits package we will retrieve.
     * 
     * @returns The benefits package that the employee with the provided id is enrolled in.
     */
    public getEmployeeBenefitsPackage = async(employeeId: number): Bluebird<void | BenefitsPackage> => {
        const payrollInfoRow: any = await this.payrollInfoDao.findOne({ where: {employeeId: employeeId }})
            .catch((e) => { console.error(e); });

        if(_.isNull(payrollInfoRow) || _.isUndefined(payrollInfoRow)){
            return null;
        }

        const benefitsPackageId = payrollInfoRow.get('benefitsPackageId');

        const benefitsPackageRow: any = await this.benefitsPackageDao.findOne({ where: {id: benefitsPackageId }})
            .catch((e) => { console.error(e); });

        if(_.isNull(benefitsPackageRow) || _.isUndefined(benefitsPackageRow)){
            return null;
        }   

        return new BenefitsPackage(
            benefitsPackageRow.get('name'),
            benefitsPackageRow.get('baseCost'),
            benefitsPackageRow.get('dependentCost')
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
    public getTotalAnnualCost = async (employee: Employee): Promise<number> => {
        const benefitsPackage: any = await this.getEmployeeBenefitsPackage(employee.id);

        var baseCost = benefitsPackage.baseCost;
        baseCost = this.discountsService.applyBenefitsDiscounts(employee, baseCost);

        const dependentCost = benefitsPackage.dependentCost;
        const dependents: any = await this.getEmployeeDependents(employee.id);
        var dependentsCost = 0.0;
        dependents.forEach((dependent) => {
            dependentsCost += this.discountsService.applyBenefitsDiscounts(dependent, dependentCost);
        });

        return baseCost + dependentsCost;
    };

};

export default BenefitsService;