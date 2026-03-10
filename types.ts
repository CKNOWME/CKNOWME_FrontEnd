export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  description: string;
  date: number;
  pdfUrl: string;
  verifyUrl: string;
  photo: string;
  cv?: string;
  category: string;
  isPublic?: boolean;
  tags?: string[];
  hash?: string;
  expiresAt?: number;
};

export type UserLinks = {
  github?: string;
  portfolio?: string;
  linkedin?: string;
  website?: string;
};

export type User = {
  username: string;
  name: string;
  email: string;
  photo: string;
  cv?: string;
  age?: number;
  studies?: string;
  links?: UserLinks;
  certs: string[];
};

export type PublicUser = {
  username: string;
  name: string;
  photo: string;
  cv?: string;
  age?: number;
  studies?: string;
  links?: UserLinks;
  certs: Certificate[];
};

export type Message = {
  message: string;
  visible: boolean;
};
