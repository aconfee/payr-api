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

const queries = `
type Query {
  dummy: Dummy,
  employees: [Employee]
  dependents: [Dependent]
}
`;

const typeDefs = queries.concat(
  dummyTypedef,
  dependentTypedef,
  employeeTypedef
);

// TEMP
const dependents = [
  { id: '1', firstname: 'Kim', lastname: 'Greenough', employeeId: '1' },
  { id: '2', firstname: 'Uma', lastname: 'the Skish', employeeId: '1' },
  { id: '3', firstname: 'Max', lastname: 'the Bear', employeeId: '2' }
];

// TEMP
const employees = [
  {
      id: '1',
      firstname: 'Adamserv',
      lastname: 'Estelaserv',
      salary: 52000,
      totalAnnualCost: 2250,
      paycheckDeduction: 86.54,
      discounts: ["10% Discount - Name Begins With Letter 'A'"]
  },
  {
      id: '2',
      firstname: 'Kimserv',
      lastname: 'Greenoughserv',
      salary: 52000,
      totalAnnualCost: 2000,
      paycheckDeduction: 76.92,
      discounts: []
  }
];

const resolvers = {
  // Query resolvers
  Query: {
      dependents: (): any => {
          return dependents;
      }, 
      employees: (): any => {
          return employees;
      }
  },

  Employee: {
      dependents: (employee): any => { return dependents.filter(dependent => dependent.employeeId === employee.id); }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;