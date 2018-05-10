/**
 * TODO: Question
 * Right now, there's not a *clear* place to do biz logic. Service seems like a mix 
 * of querying and mapping to biz logic objects, and actual biz logic functions. 
 * 
 * I've seen the command handler pattern used in such a way that handlers consume services
 * and all the logic is contained to handlers while queries are handled in services. This bloats
 * really fast though (if truly proper cmd handler pattern is in place).
 * 
 * What are other options for separating queries/mapping from logic (logic that consumes and uses
 * the resulting objects of those queries and returns a 'VM').
 */

import Dependent from './models/dependent.model';
import Employee from './models/employee.model';
import BenefitsPackage from './models/benefitsPackage.model';
import Bluebird from 'bluebird'; 
import Sequelize from 'sequelize';
import DiscountsService from './discounts.service';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';


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
        const dependentRows: any = await this.dependentDao.findAll({ 
            where: {employeeId: employeeId },
            attributes: ['id', 'firstname', 'lastname']
        })
        .catch((e) => { console.error(e); });

        if(isNull(dependentRows) || isUndefined(dependentRows)){
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
        const payrollInfoRow: any = await this.payrollInfoDao.findOne({ 
            where: { employeeId: employeeId },
            attributes: ['benefitsPackageId']
        })
        .catch((e) => { console.error(e); });

        if(isNull(payrollInfoRow) || isUndefined(payrollInfoRow)){
            return null;
        }

        const benefitsPackageRow: any = await this.benefitsPackageDao.findOne({ 
            where: { id: payrollInfoRow.get('benefitsPackageId') },
            attributes: ['name', 'baseCost', 'dependentCost']
        })
        .catch((e) => { console.error(e); });

        if(isNull(benefitsPackageRow) || isUndefined(benefitsPackageRow)){
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