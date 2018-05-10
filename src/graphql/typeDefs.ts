import queryTypedef from './types/query.type';
import mutationTypedef from './types/mutation.type';
import employeeTypedef from './types/employee.type';
import dependentTypedef from './types/dependent.type';
import payrollInfoTypedef from './types/payrollInfo.type';

const typeDefs = queryTypedef.concat(
    mutationTypedef,
    dependentTypedef,
    employeeTypedef, 
    payrollInfoTypedef
);

export default typeDefs;