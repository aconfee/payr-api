/**
 * This file is basically DI for all the services and resolvers.
 */

import EmployeeDao from '../data/daos/payroll/employee.dao';
import PayrollInfoDao from '../data/daos/payroll/payrollInfo.dao';
import BenefitsPackageDao from '../data/daos/benefits/benefitsPackage.dao';
import DependentDao from '../data/daos/benefits/dependent.dao';

import DiscountsService from '../business/services/benefits/discounts.service';
import EmployeeService from '../business/services/payroll/employee.service';
import BenefitsService from '../business/services/benefits/benefits.service';

import queryResolver from './resolvers/query.resolver';
import mutationResolver from './resolvers/mutation.resolver';
import employeeResolver from './resolvers/employee.resolver';
import dependentResolver from './resolvers/dependent.resolver';

const employeeDao = new EmployeeDao();
const payrollInfoDao = new PayrollInfoDao();
const benefitsPackageDao = new BenefitsPackageDao();
const dependetDao = new DependentDao();

const discountsService = new DiscountsService();
const employeeService = new EmployeeService(employeeDao, payrollInfoDao);
const benefitsService = new BenefitsService(dependetDao, payrollInfoDao, benefitsPackageDao, discountsService);

var resolvers = Object.assign({}, queryResolver(employeeService));
resolvers = Object.assign(resolvers, mutationResolver(employeeService, benefitsService));
resolvers = Object.assign(resolvers, employeeResolver(benefitsService, employeeService, discountsService));
resolvers = Object.assign(resolvers, dependentResolver(benefitsService, discountsService));

export default resolvers;