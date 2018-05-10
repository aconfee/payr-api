const employeeTypedef = `
type Employee {
  id: Int!
  firstname: String!
  lastname: String!
  payrollInfo: PayrollInfo
  benefitsTotalAnnualCost: Float
  benefitsDiscounts: [String]
  dependents: [Dependent]
}
`;

export default employeeTypedef;