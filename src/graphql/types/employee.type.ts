const employeeTypedef = `
type Employee {
  id: String!
  firstname: String!
  lastname: String!
  payrollInfo: PayrollInfo
  benefitsTotalAnnualCost: Float
  benefitsDiscounts: [BenefitsDiscount]
  dependents: [Dependent]
}
`;

export default employeeTypedef;