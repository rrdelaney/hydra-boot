// @flow

import { readFileSync } from 'fs'
import path from 'path'
import { makeExecutableSchema } from 'graphql-tools'
import * as resolvers from './resolvers'

const schemaFile = path.join(__dirname, '..', '..', 'schema.graphql')
const typeDefs = readFileSync(schemaFile).toString()

export default makeExecutableSchema({
  typeDefs,
  resolvers
})
