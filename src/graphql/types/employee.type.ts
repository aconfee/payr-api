const employeeTypedef = `
type Employee {
  id: String!
  firstname: String!
  lastname: String
  payrollInfo: PayrollInfo
  benefitsTotalAnnualCost: Float
  paycheckDeduction: Float
  benefitsDiscounts: [BenefitsDiscount]
  discounts: [String] 
  dependents: [Dependent]
}
`;

export default employeeTypedef;