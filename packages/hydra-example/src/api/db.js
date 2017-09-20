// @flow

import massive from 'massive'
import log from '../log'

export default massive(process.env.DATABASE_URL, undefined, {
  query(e) {
    const { query } = e
    const shouldLogQuery =
      !query.includes('current_schema') &&
      !query.includes('table_schema') &&
      !query.includes('schemaname') &&
      !query.includes('pg_namespace')

    if (shouldLogQuery) {
      log(query, 'QUERY', 'magenta')
    }
  }
})
