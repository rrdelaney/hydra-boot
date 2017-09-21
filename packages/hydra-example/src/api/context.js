// @flow

import DataLoader from 'dataloader'

export type User = {
  id: string,
  name: string
}

export type Article = {
  id: number,
  title: string,
  content: string,
  community_id: string,
  author_id: string
}

export type Community = {
  id: string,
  name: string
}

export type Issue = {
  id: number,
  headline: string,
  published: Date,
  article_ids: number[],
  community_id: string
}

export default class Context {
  async userById(id: string): Promise<User> {
    return { id: '1', name: 'Ryan Delaney' }
  }

  async articlesByUser(id: string): Promise<Article[]> {
    return [
      {
        id: 1,
        title: 'Hello world',
        content: 'hello world',
        community_id: 'Heyyy',
        author_id: '1'
      }
    ]
  }

  async articleById(id: number): Promise<Article> {
    return {
      id: 1,
      title: 'Hello world',
      content: 'hello world',
      community_id: 'Heyyy',
      author_id: '1'
    }
  }

  async articlesByCommunity(
    id: string,
    offset?: number,
    limit?: number
  ): Promise<Article[]> {
    return [
      {
        id: 1,
        title: 'Hello world',
        content: 'hello world',
        community_id: 'c',
        author_id: '1'
      }
    ]
  }

  async communityById(id: string): Promise<Community> {
    return {
      id: 'c',
      name: 'C'
    }
  }

  async issueById(id: string): Promise<Issue> {
    return {
      id: 1,
      headline: 'Hey!',
      published: new Date(),
      article_ids: [1],
      community_id: 'c'
    }
  }

  async issuesByCommunity(
    id: string,
    offset?: number,
    limit?: number
  ): Promise<Issue[]> {
    return [
      {
        id: 1,
        headline: 'Hey!',
        published: new Date(),
        article_ids: [1],
        community_id: 'c'
      }
    ]
  }
}
