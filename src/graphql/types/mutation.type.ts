const mutationTypedef = `
type Mutation {
    addEmployee(firstname: String!, lastname: String!): Employee
    removeEmployee(id: Int!): Boolean
    addDependent(employeeId: Int!, firstname: String!, lastname: String!): Dependent
    removeDependent(id: Int!): Boolean
}
`;

export default mutationTypedef;