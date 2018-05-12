const queryTypedef = `
type Query {
    employees: [Employee]
    employee(id: Int!): Employee
}
`;

export default queryTypedef;