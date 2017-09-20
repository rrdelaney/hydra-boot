// @flow

import * as React from 'react'
import { gql, graphql } from 'react-apollo'
import styled from 'styled-components'
import { Container, Label, Image, Header, Loader } from 'semantic-ui-react'
import AppContainer from './AppContainer'

const ArticleData = gql`
  query ArticleData($id: ID!) {
    article(id: $id) {
      id
      title
      content
      community {
        id
        name
      }
      author {
        id
        name
      }
    }
  }
`

const ArticleContainer = styled.div`padding: 1rem;`
const ArticleHeader = styled.div`width: 100vw;`

function Article({ data }) {
  if (data.loading) return <Loader active />
  if (!data.article) return null

  return (
    <AppContainer>
      <ArticleHeader>
        <Image src="https://unsplash.it/1000/300/?blur" fluid />
      </ArticleHeader>
      <Container text as={ArticleContainer}>
        <Label tag color="teal">
          {data.article.community.name}
        </Label>
        <Header size="huge">{data.article.title}</Header>
        <Header size="small">{data.article.author.name}</Header>
        <p>{data.article.content}</p>
      </Container>
    </AppContainer>
  )
}

export default graphql(ArticleData, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(Article)
