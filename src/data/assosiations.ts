import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './employee.dao';
import DependentDao from './dependent.dao'
import BenefitsDiscountsDao from './benefitsDiscount.dao';
import EmployeeBenefitsDiscountDao from './employeeBenefitsDiscount.dao';
import BenefitsDiscountDao from './benefitsDiscount.dao';
import PayrollInfoDao from './payrollInfo.dao';
import BenefitsPackageDao from './benefitsPackage.dao';

// Create FK on Dependents and provide getDependents accessor on EmployeeDao
EmployeeDao.hasMany(DependentDao, { as: 'dependents' });
EmployeeDao.belongsToMany(BenefitsDiscountsDao, { through: EmployeeBenefitsDiscountDao })

BenefitsDiscountDao.belongsToMany(EmployeeDao, { through: EmployeeBenefitsDiscountDao });

// Create FK on PayrollInfo rows.
PayrollInfoDao.belongsTo(EmployeeDao, { foreignKey: 'employeeId' });

// Creates FK on PayrollInfo 
BenefitsPackageDao.hasMany(PayrollInfoDao, {foreignKey: 'benefitsPackageId' });