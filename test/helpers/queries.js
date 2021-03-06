import { GraphQLID, GraphQLList } from 'graphql';
import errorLogger from './errorLogger';

export default (type) => ({
  [`fetch${type.name}`]: {
    args: { id: { type: GraphQLID } },
    actions: {
      finalize: (args, ctx) => ctx.data,
      error: (err) => errorLogger().add(err),
      resolve: (args, ctx) => type.model.get(args).then(data => (ctx.data = data)),
    },
  },
  [`all${type.name}s`]: {
    output: GraphQLList,
    actions: {
      finalize: (args, ctx) => ctx.data,
      error: (err) => errorLogger().add(err),
      resolve: (args, ctx) => type.model.getAll().then(data => (ctx.data = data)),
    },
  },
});
