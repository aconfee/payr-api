// //import { IDummyService } from "../../services/dummy.service";
// //import Dummy from '../../services/models/dummy.model';

// const dependents = [
//     { id: '1', name: 'Kim Greenough', employeeId: '1' },
//     { id: '2', name: 'Uma the Skish', employeeId: '1' },
//     { id: '3', name: 'Max the Bear', employeeId: '2' }
// ];

// const employees = [
//     {
//         id: '1',
//         firstname: 'Adam',
//         lastname: 'Estela',
//         salary: 52000,
//         totalAnnualCost: 2250,
//         paycheckDeduction: 86.54,
//         discounts: ["10% Discount - Name Begins With Letter 'A'"],
//         dependents: [
//             { id: '1', name: 'Kim Greenough' },
//             { id: '2', name: 'Uma the Skish' }
//         ]
//     },
//     {
//         id: '2',
//         firstname: 'Kim',
//         lastname: 'Greenough',
//         salary: 52000,
//         totalAnnualCost: 2000,
//         paycheckDeduction: 76.92,
//         discounts: [],
//         dependents: [
//             { id: '1', name: 'Max the Bear' }
//         ]
//     }
// ];

// const employeeResolver = (/*service: IEmployeeService*/): any => {

//     return {
//         // Query resolvers
//         Query: {
//             dependents: (): any => {
//                 return dependents;
//             }, 
//             employees: (): any => {
//                 return employees;
//             }
//         },

//         // Employee resolver
//         Employee: {
//             dependents: (employee) => { dependents.filter(dependent => dependent.employeeId === employee.id); }
//         }

//         // Dependents -- nothing to resolve
//     };
// }

// export default employeeResolver;