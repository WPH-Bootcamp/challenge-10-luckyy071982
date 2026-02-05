export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username: string;
}
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
    username: string;
  };
}
export interface CreateCommentRequest {
  content: string;
}
