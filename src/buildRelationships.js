import { GraphQLList, isOutputType } from 'graphql';

export default (type, objectTypes) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const {
      field,
      relation,
      name,
      args = {},
      output: OutputType,
    } = relationship;

    let outputType;

    // TODO: minimize cyclomatic complexity
    if (isOutputType(OutputType)) {
      outputType = OutputType;
    } else {
      if (relation === 'hasMany') {
        outputType = (
          OutputType &&
          new OutputType(objectTypes[name]) ||
          new GraphQLList(objectTypes[name])
        );
      } else {
        outputType = (
          OutputType &&
          new OutputType(objectTypes[name]) ||
          objectTypes[name]
        );
      }
    }

    return {
      ...prev,
      [field]: {
        args,
        type: outputType,
        resolve(parent, fieldArgs, ctx) {
          if (!parent) return null;
          const fieldResolver = parent[field];

          if (typeof fieldResolver !== 'function') return fieldResolver;
          return parent[field](fieldArgs, ctx);
        },
      },
    };
  }, {});
};
