import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './employee.dao';
import DependentDao from './dependent.dao'
import PayrollInfoDao from './payrollInfo.dao';
import BenefitsPackageDao from './benefitsPackage.dao';

// Create FK on Dependents and provide getDependents accessor on EmployeeDao
EmployeeDao.hasMany(DependentDao, { as: 'dependents' });

// Create FK on PayrollInfo rows.
PayrollInfoDao.belongsTo(EmployeeDao, { foreignKey: 'employeeId' });

// Creates FK on PayrollInfo 
BenefitsPackageDao.hasMany(PayrollInfoDao, {foreignKey: 'benefitsPackageId' });