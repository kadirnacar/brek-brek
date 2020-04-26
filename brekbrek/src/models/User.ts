export interface IUser {
  displayName?: string;
  email?: string;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  metadata?: IUserMetadata;
  phoneNumber?: string;
  photoURL?: string;
  providerData?: IUserInfo[];
  providerId?: string;
  uid?: string;
}

export interface IUserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
}

export interface IUserInfo {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    photoURL?: string;
    providerId?: string;
    uid?: string;
  }