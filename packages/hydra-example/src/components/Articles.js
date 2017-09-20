import React from 'react'
import { gql, graphql } from 'react-apollo'
import { Loader, List } from 'semantic-ui-react'

const MyPosts = gql`
  query MyPosts {
    self {
      id
      posts {
        title
      }
    }
  }
`

const Posts = ({ data }) => {
  if (data.loading) return <Loader active />
  if (!data.self) return null

  return (
    <List>
      {data.self.posts.map(post => (
        <List.Item key={post.title}>{post.title}</List.Item>
      ))}
    </List>
  )
}

export default graphql(MyPosts)(Posts)
