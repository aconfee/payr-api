import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import dummyResolver from './resolvers/dummy.resolver';
import dummyTypedef from './types/dummy.type';
import DummyService from '../services/dummy.service';
import DummyDao from '../data/dummy.dao';

//import employeeResolver from './resolvers/employee.resolver';
import employeeTypedef from './types/employee.type';
//import EmployeeService from '../services/employee.service';
//import EmployeeDao from '../data/employee.dao';

//import dependentResolver from './resolvers/dependent.resolver';
import dependentTypedef from './types/dependent.type';
import payrollInfoTypedef from './types/payrollInfo.type';
import benefitsDiscountTypedef from './types/benefitsDiscount.type';

const queries = `
type Query {
  dummy: Dummy,
  employees: [Employee]
  dependents: [Dependent],
  payrollInfo: [PayrollInfo]
  benefitsDiscounts: [BenefitsDiscount]
}
`;

const typeDefs = queries.concat(
  dummyTypedef,
  dependentTypedef,
  employeeTypedef, 
  payrollInfoTypedef,
  benefitsDiscountTypedef
);

// TEMP
const employees = [
  {
      id: '1',
      firstname: 'Adamserv',
      lastname: 'Estelaserv'
  },
  {
      id: '2',
      firstname: 'Kimserv',
      lastname: 'Greenoughserv'
  }
];

const payrollInfo = [
    { employeeId: '1', salary: 52000, paychecksPerYear: 26 },
    { employeeId: '2', salary: 52000, paychecksPerYear: 26 }
];

const benefitsDiscounts = [
    { name: 'Firstname starts with letter A', discountPercent: .10 }
];

const benefitsPackage = [
    { baseCost: 1000, dependentCost: 500 }
];

// TEMP
const dependents = [
    { id: '1', firstname: 'Kim', lastname: 'Greenough', employeeId: '1' },
    { id: '2', firstname: 'Uma', lastname: 'the Skish', employeeId: '1' },
    { id: '3', firstname: 'Max', lastname: 'the Bear', employeeId: '2' }
  ];

const resolvers = {
    // Query resolvers
    Query: {
        dependents: (): any => {
            return dependents;
        }, 
        employees: (): any => {
            return employees;
        },
        payrollInfo: (): any => {
            return payrollInfo;
        }
    },

    Employee: {
        dependents: (employee): any => { return dependents.filter(dependent => dependent.employeeId === employee.id); },
        payrollInfo: (employee): any => { return payrollInfo.filter(info => info.employeeId === employee.id)[0] },
        benefitsDiscounts: (employee): any => { 
            if(employee.firstname[0].toLowerCase() === 'a')
                return benefitsDiscounts; 
            else    
                return null;
        },
        benefitsTotalAnnualCost: (employee): any => {
            const baseCost = benefitsPackage[0].baseCost;
            const dependentCost = benefitsPackage[0].dependentCost;
            const dependentsCount = dependents.filter(d => d.employeeId === employee.id).length;
            const discountAmmount = benefitsDiscounts[0].discountPercent; // no filter...

            var annualCost = baseCost + (dependentCost * dependentsCount);
            return annualCost *= (1 - discountAmmount);
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;