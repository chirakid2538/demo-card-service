export interface SignDataJWT {
  sub: number;
  displayName: string;
  email: string;
  profileImageURL: string | null;
  createdAt: string;
  updatedAt: string;
}
