const mutationTypedef = `
type Mutation {
    addEmployee(firstname: String!, lastname: String!): Employee
    removeEmployee(id: Int!): Boolean
}
`;

export default mutationTypedef;