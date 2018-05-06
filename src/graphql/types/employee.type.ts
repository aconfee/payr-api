const employeeTypedef = `
type Employee {
  id: String!
  firstname: String!
  lastname: String
  salary: Float
  totalAnnualCost: Float
  paycheckDeduction: Float
  discounts: [String] 
  dependents: [Dependent]
}
`;

export default employeeTypedef;