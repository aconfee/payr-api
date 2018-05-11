/**
 * Normally handled much more gracefully: https://github.com/sequelize/express-example/blob/master/models/index.js
 * 
 * Waiting to implement until I fully understand -- mostly just want to know how model.associate is working.
 */

import sequelize from './dbContext';
import EmployeeSchema from './schema/employee.schema';
import PayrollInfoSchema from './schema/payrollInfo.schema';
import BenefitsPackageSchema from './schema/benefitsPackage.schema';
import DependentSchema from './schema/dependent.schema';

EmployeeSchema.hasOne(PayrollInfoSchema, { foreignKey: 'employeeId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
PayrollInfoSchema.belongsTo(EmployeeSchema); // Just for ORM relational methods.

EmployeeSchema.hasMany(DependentSchema, { foreignKey: 'employeeId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
DependentSchema.belongsTo(EmployeeSchema, { foreignKey: 'employeeId', onUpdate: 'CASCADE', onDelete: 'CASCADE' }); // Just for ORM

// Puts FK on payroll info, creating link to benefits. If benefits is ever deleted, FK will be set to null. 
BenefitsPackageSchema.hasMany(PayrollInfoSchema, { foreignKey: 'benefitsPackageId', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
PayrollInfoSchema.belongsTo(BenefitsPackageSchema, { foreignKey: 'benefitsPackageId', onUpdate: 'CASCADE', onDelete: 'SET NULL' }); // Just for ORM

const db = {
    EmployeeSchema,
    PayrollInfoSchema,
    BenefitsPackageSchema,
    DependentSchema,
    sequelize
};

// RESET APP
// sequelize.sync({force: true}).then(() => {
//     BenefitsPackageSchema.create({
//         name: 'Default Company Benefits',
//         baseCost: 1000,
//         dependentCost: 500
//     });
// });

export default db;