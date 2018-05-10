import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import dependentTypedef from './types/dependent.type';
import DependentDao from '../data/dependent.dao';
import BenefitsPackageDao from '../data/benefitsPackage.dao';
import payrollInfoTypedef from './types/payrollInfo.type';
import PayrollInfoDao from '../data/payrollInfo.dao';
//import employeeResolver from './resolvers/employee.resolver';
import employeeTypedef from './types/employee.type';
import EmployeeService from '../services/employee.service';
import DiscountsService from '../services/discounts.service';
import BenefitsService from '../services/benefits.service';
import EmployeeDao from '../data/employee.dao';

const discountsService = new DiscountsService();

const employeeService = new EmployeeService(
    EmployeeDao, 
    PayrollInfoDao
);
const benefitsService = new BenefitsService(
    DependentDao, 
    PayrollInfoDao, 
    BenefitsPackageDao,
    discountsService
);

const queries = `
type Query {
    employees: [Employee]
}

type Mutation {
    addEmployee(firstname: String!, lastname: String!): Employee
    removeEmployee(id: Int!): Boolean
}
`;

const typeDefs = queries.concat(
  dependentTypedef,
  employeeTypedef, 
  payrollInfoTypedef
);

const resolvers = {
    Query: {
        employees: (): any => { return employeeService.getEmployees(); }
    },

    Mutation: {
        addEmployee: (root, args) => { return employeeService.addEmployee(args.firstname, args.lastname); },
        removeEmployee: (root, args) => { return employeeService.removeEmployee(args.id); }
    },

    Employee: {
        dependents: (employee): any => { return benefitsService.getEmployeeDependents(employee.id); },
        payrollInfo: (employee): any => { return employeeService.getEmployeePayrollInfo(employee.id); },
        benefitsDiscounts: (employee): any => { return discountsService.getAllEligableBenefitsDiscounts(employee).map(discount => discount.name); },
        benefitsTotalAnnualCost: async (employee): Promise<any> => { return benefitsService.getTotalAnnualCost(employee); }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;