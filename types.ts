export interface Article {
  content: string;
  created_at: string;
  description: string;
  id: number;
  image: string;
  slug: string;
  tags: string[];
  title: string;
  author_name: string;
  author_image: string;
  upvotes_count: number;
  author_followers_count: number;
  is_bookmarked_by_current_user: boolean;
  is_upvoted_by_current_user: boolean;
  is_author_followed_by_current_user: boolean;
  comments_count: number;
}

export interface SuccessResponse {
  success: string;
}

export interface CommentData {
  author_image: string;
  author_name: string;
  created_date: string;
  id: number;
  parent_comment: number;
  post: string;
  text: string;
  upvotes_count: number;
  is_upvoted_by_current_user: boolean;
}

export interface ProfileInfo {
  first_name: string;
  last_name: string;
  email: string;
  about: string;
  username: string;
  avatar: string;
  country: string;
}

export interface ErrorKeyValue {
  name: string;
  data: string;
}

export interface UserInfo {
  password?: string;
  username: string;
}

export interface Share {
  url: string;
  title: string;
  description: string;
  quote: string;
  hashtags: string[];
  twitterUser: string;
  imageURL: string;
}

export interface Network {
  type: string;
  name: string;
  icon: string;
}
