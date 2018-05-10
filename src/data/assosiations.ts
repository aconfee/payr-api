import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './daos/employee.dao';
import DependentDao from './daos/dependent.dao'
import PayrollInfoDao from './daos/payrollInfo.dao';
import BenefitsPackageDao from './daos/benefitsPackage.dao';

// Create FK on Dependents and provide getDependents accessor on EmployeeDao
EmployeeDao.hasMany(DependentDao, { as: 'dependents' });

// Create FK on PayrollInfo rows.
PayrollInfoDao.belongsTo(EmployeeDao, { foreignKey: 'employeeId' });

// Creates FK on PayrollInfo 
BenefitsPackageDao.hasMany(PayrollInfoDao, {foreignKey: 'benefitsPackageId' });