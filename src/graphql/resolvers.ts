/**
 * This file is basically DI for all the services and resolvers.
 */

import EmployeeDao from '../data/daos/employee.dao';
import PayrollInfoDao from '../data/daos/payrollInfo.dao';
import BenefitsPackageDao from '../data/daos/benefitsPackage.dao';
import DependentDao from '../data/daos/dependent.dao';

import DiscountsService from '../services/discounts.service';
import EmployeeService from '../services/employee.service';
import BenefitsService from '../services/benefits.service';

import queryResolver from './resolvers/query.resolver';
import mutationResolver from './resolvers/mutation.resolver';
import employeeResolver from './resolvers/employee.resolver';

const employeeDao = new EmployeeDao();
const payrollInfoDao = new PayrollInfoDao();
const benefitsPackageDao = new BenefitsPackageDao();
const dependetDao = new DependentDao();

const discountsService = new DiscountsService();
const employeeService = new EmployeeService(employeeDao, payrollInfoDao);
const benefitsService = new BenefitsService(dependetDao, payrollInfoDao, benefitsPackageDao, discountsService);

var resolvers = Object.assign({}, queryResolver(employeeService));
resolvers = Object.assign(resolvers, mutationResolver(employeeService, benefitsService));
resolvers = Object.assign(resolvers, employeeResolver(benefitsService, employeeService, discountsService))

export default resolvers;