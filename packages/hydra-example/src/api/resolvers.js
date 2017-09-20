// @flow

import type Context, {
  User as UserType,
  Article as ArticleType,
  Issue as IssueType,
  Community as CommunityType
} from './context'

export const Query = {
  user(root: mixed, { id }: { id: string }, c: Context) {
    return c.userById(id)
  },

  article(root: mixed, { id }: { id: number }, c: Context) {
    return c.articleById(id)
  },

  community(root: mixed, { id }: { id: string }, c: Context) {
    return c.communityById(id)
  },

  self(root: mixed, args: mixed, c: Context) {
    if (c.user === null) return

    return c.userById(c.user.id)
  }
}

export const User = {
  articles({ id }: UserType, args: mixed, c: Context) {
    return c.articlesByUser(id)
  }
}

export const Article = {
  author({ author_id }: ArticleType, args: mixed, c: Context) {
    return c.userById(author_id)
  },

  community({ community_id }: ArticleType, args: mixed, c: Context) {
    return c.communityById(community_id)
  }
}

export const Community = {
  articles(
    { id }: CommunityType,
    args: { offset: number, limit: number },
    c: Context
  ) {
    return c.articlesByCommunity(id, args.offset, args.limit)
  },

  issues({ id }: CommunityType, args: mixed, c: Context) {
    return c.issuesByCommunity(id)
  }
}

export const Issue = {
  articles({ article_ids }: IssueType, args: mixed, c: Context) {
    return Promise.all(article_ids.map(id => c.articleById(id)))
  }
}
