import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import dependentTypedef from './types/dependent.type';
import DependentDao from '../data/dependent.dao';
import benefitsDiscountTypedef from './types/benefitsDiscount.type';
import BenefitsPackageDao from '../data/benefitsPackage.dao';
import payrollInfoTypedef from './types/payrollInfo.type';
import PayrollInfoDao from '../data/payrollInfo.dao';
//import employeeResolver from './resolvers/employee.resolver';
import employeeTypedef from './types/employee.type';
import EmployeeService from '../services/employee.service';
import BenefitsService from '../services/benefits.service';
import BenefitsDiscountDao from '../data/benefitsDiscount.dao';
import EmployeeBenefitsDiscountDao from '../data/employeeBenefitsDiscount.dao';
import EmployeeDao from '../data/employee.dao';
import Sequelize from 'sequelize';
import _ from 'lodash';
const Op = Sequelize.Op;

const employeeService = new EmployeeService(
    EmployeeDao, 
    PayrollInfoDao
);
const benefitsService = new BenefitsService(
    DependentDao, 
    PayrollInfoDao, 
    BenefitsPackageDao, 
    EmployeeBenefitsDiscountDao, 
    BenefitsDiscountDao
);

const queries = `
type Query {
  employees: [Employee]
}
`;

const typeDefs = queries.concat(
  dependentTypedef,
  employeeTypedef, 
  payrollInfoTypedef,
  benefitsDiscountTypedef
);

// TEMP
const benefitsDiscounts = [
    { name: 'Firstname starts with letter A', discountPercent: .10 }
];

const resolvers = {
    // Query resolvers
    Query: {
        employees: (): any => { return employeeService.getEmployees(); }
    },

    Employee: {
        dependents: (employee): any => { return benefitsService.getEmployeeDependents(employee.id); },
        payrollInfo: (employee): any => { return employeeService.getEmployeePayrollInfo(employee.id); },
        benefitsDiscounts: (employee): any => { return benefitsService.getEmployeeBenefitsDiscounts(employee.id); },

        // TODO: This logic and calculation should be done in a handler.
        // Can be severl functions in a handler: getTotalDiscount, getTotalAnnualCost. 
        benefitsTotalAnnualCost: async (employee): Promise<any> => {
            const benefitsPackage: any = await benefitsService.getEmployeeBenefitsPackage(employee.id);

            const baseCost = benefitsPackage.baseCost;
            const dependentCost = benefitsPackage.dependentCost;
            const dependents: any = await benefitsService.getEmployeeDependents(employee.id);
            const dependentsCount = dependents.length;
            const discounts: any = await benefitsService.getEmployeeBenefitsDiscounts(employee.id);
            var totalDiscountPercent = 0.0;

            if(!_.isNull(discounts)){
                discounts.forEach(element => {
                    totalDiscountPercent += element.discountPercent;
                });
                
                totalDiscountPercent = Math.min(totalDiscountPercent, 1.0);
            }

            var annualCost = benefitsPackage.baseCost + (benefitsPackage.dependentCost * dependentsCount);
            return annualCost *= (1 - totalDiscountPercent);
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;