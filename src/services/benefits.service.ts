import Dependent from './models/dependent.model';
import BenefitsPackage from './models/benefitsPackage.model';
import BenefitsDiscount from './models/benefitsDiscount.model'
import DependentDao from '../data/dependent.dao';
import BenefitsPackageDao from '../data/benefitsPackage.dao';
import PayrollInfoDao from '../data/payrollInfo.dao';
import Bluebird from 'bluebird'; // Promise library for Sequelize
import _ from 'lodash';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;


export interface IBenefitsService {
    getEmployeeDependents(employeeId: number): Bluebird<void | Dependent[]>;
    getEmployeeBenefitsPackage(employeeId: number): Bluebird<void | BenefitsPackage>;
    getEmployeeBenefitsDiscounts(employeeId: number): Bluebird<void | BenefitsDiscount[]>;
};

class BenefitsService implements IBenefitsService {

    private dependentDao: Sequelize.Model<{}, {}> = null;
    private payrollInfoDao: Sequelize.Model<{}, {}> = null;
    private benefitsPackageDao: Sequelize.Model<{}, {}> = null;
    private employeeBenefitsDiscountDao: Sequelize.Model<{}, {}> = null;
    private benefitsDiscountDao: Sequelize.Model<{}, {}> = null;

    constructor(
        dependentDao: Sequelize.Model<{}, {}>,
        payrollInfoDao: Sequelize.Model<{}, {}>,
        benefitsPackageDao: Sequelize.Model<{}, {}>,
        employeeBenefitsDiscountDao: Sequelize.Model<{}, {}>,
        benefitsDiscountDao: Sequelize.Model<{}, {}>
    ) {
        this.dependentDao = dependentDao;
        this.payrollInfoDao = payrollInfoDao;
        this.benefitsPackageDao = benefitsPackageDao;
        this.employeeBenefitsDiscountDao = employeeBenefitsDiscountDao;
        this.benefitsDiscountDao = benefitsDiscountDao;
    };

    /**
     * Get the dependents for the provided employee id.
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
     * Get any discounts that are associated with this employee.
     */
    public getEmployeeBenefitsDiscounts = async(employeeId: number): Bluebird<void | BenefitsDiscount[]> => {
        const employeeDiscountRows: any = await this.employeeBenefitsDiscountDao.findAll({ where: {employeeId: employeeId }})
            .catch((e) => { console.error(e); });

        if(_.isNull(employeeDiscountRows) || _.isUndefined(employeeDiscountRows) || _.isEmpty(employeeDiscountRows)){
            return null;
        }

        const discountIds = employeeDiscountRows.map((discountRow: any) => {
            return discountRow.get('benefitsdiscountId');
        });

        const discountRows: any = await this.benefitsDiscountDao.findAll({where: { id: {[Op.or]: discountIds }}})
            .catch((e) => { console.error(e); });

        const discounts = discountRows.map((discountRow) => {
            return new BenefitsDiscount(
                discountRow.get('name'),
                discountRow.get('discountPercent')
            );
        });

        return discounts;
    };

};

export default BenefitsService;