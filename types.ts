import type { OutputData } from '@editorjs/editorjs';

export interface Article {
  html_content: string;
  created_at: string;
  description: string;
  id: number;
  images: ImageInfo[];
  preview_image: string;
  slug: string;
  tags: string[];
  title: string;
  author_name: string;
  author_image: string;
  author_about: string;
  upvotes_count: number;
  author_followers_count: number;
  is_bookmarked_by_current_user: boolean;
  is_upvoted_by_current_user: boolean;
  is_author_followed_by_current_user: boolean;
  comments_count: number;
  content: OutputData;
}

export interface BlockData {
  id: string;
  type:
    | 'header'
    | 'paragraph'
    | 'list'
    | 'quote'
    | 'image'
    | 'checklist'
    | 'warning'
    | 'table'
    | 'code';
  data:
    | HeaderBlock
    | ParagraphBlock
    | ListBlock
    | QuoteBlock
    | ImageBlock
    | ChecklistBlock
    | WarningBlock
    | TableBlock
    | CodeBlock;
}

interface HeaderBlock {
  text: string;
  level: number;
}

interface ParagraphBlock {
  text: string;
}

interface ListBlock {
  style: string;
  items: string[];
}

interface QuoteBlock {
  text: string;
  caption: string;
  alignment: string;
}

interface ImageBlock {
  file: {
    url: string;
  };
  caption: string;
  withBorder: boolean;
  stretched: boolean;
  withBackground: boolean;
}

interface ChecklistBlock {
  items: {
    text: string;
    checked: boolean;
  }[];
}

interface WarningBlock {
  title: string;
  message: string;
}

interface TableBlock {
  withHeadings: boolean;
  content: string[][];
}

interface CodeBlock {
  code: string;
}

export interface ImageInfo {
  created_at: string;
  draft: null | string;
  id: number;
  image: string;
  image_url: string;
  post: number;
}

export interface SuccessResponse {
  success: string | boolean;
}

export interface CommentData {
  author_image: string;
  author_name: string;
  created_date: string;
  id: number;
  parent_comment: number;
  post: string;
  post_slug: string;
  text: string;
  upvotes_count: number;
  is_upvoted_by_current_user: boolean;
  replies_count: number;
  replies?: CommentData[];
}

export interface ProfileInfo {
  first_name: string;
  last_name: string;
  email: string;
  about: string;
  username: string;
  avatar_url: string;
  avatar?: File | null;
  country: string;
  followers_count: number;
  author_about: string;
  is_followed_by_current_user: boolean;
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
