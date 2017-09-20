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
  db: any
  user: { id: string, name: string } | null

  constructor(db: any, user: { id: string, name: string } | null) {
    this.user = user
    this.db = db
  }

  userById(id: string): Promise<User> {
    return this.db.users.findOne({ id })
  }

  articlesByUser(id: string): Promise<Article[]> {
    return this.db.articles.find({ author_id: id })
  }

  articleById(id: number): Promise<Article> {
    return this.db.articles.findOne({ id })
  }

  articlesByCommunity(
    id: string,
    offset?: number,
    limit?: number
  ): Promise<Article[]> {
    return this.db.articles.find(
      { community_id: id },
      { offset, limit, order: 'published' }
    )
  }

  communityById(id: string): Promise<Community> {
    return this.db.communities.findOne({ id })
  }

  issueById(id: string): Promise<Issue> {
    return this.db.issues.findOne({ id })
  }

  issuesByCommunity(
    id: string,
    offset?: number,
    limit?: number
  ): Promise<Issue[]> {
    return this.db.issues.find(
      { community_id: id },
      { offset, limit, order: 'published' }
    )
  }
}
