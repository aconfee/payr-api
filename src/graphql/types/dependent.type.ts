const dependentTypedef = `
type Dependent {
  id: Int!
  employeeId: Int!
  firstname: String!
  lastname: String!
  addonCost: Int!
  benefitsDiscounts: [String]
}
`;

export default dependentTypedef;