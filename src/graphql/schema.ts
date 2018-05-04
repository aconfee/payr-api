import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import dummyResolver from'./resolvers/dummy.resolver';
import dummyTypedef from './types/dummy.type';
import DummyService from '../services/dummy.service';
import DummyDao from '../data/dummy.dao';

const queries = `
type Query {
  dummy: Dummy
}
`;

const typeDefs = queries.concat(
  dummyTypedef
);

const resolvers = (<any>Object).assign({}, 
  dummyResolver(new DummyService(DummyDao)
));

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;