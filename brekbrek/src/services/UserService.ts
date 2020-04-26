import config from '@config';
import {IUser, Result} from '@models';
import {ServiceBase} from './ServiceBase';
import auth from '@react-native-firebase/auth';

export class UserService extends ServiceBase {
  public static async getItem(username: string, password: string) {
    try {
      const createResult = await auth().signInWithEmailAndPassword(
        username.trim(),
        password.trim(),
      );
      let result: Result<IUser> = new Result<IUser>({
        displayName: createResult.user.displayName,
        email: createResult.user.email,
        emailVerified: createResult.user.emailVerified,
        isAnonymous: createResult.user.isAnonymous,
        metadata: createResult.user.metadata
          ? {
              creationTime: createResult.user.metadata.creationTime,
              lastSignInTime: createResult.user.metadata.lastSignInTime,
            }
          : null,
        phoneNumber: createResult.user.phoneNumber,
        photoURL: createResult.user.displayName,
        providerData: createResult.user.providerData
          ? createResult.user.providerData.map((data) => {
              return {
                displayName: data.displayName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                photoURL: data.photoURL,
                providerId: data.providerId,
                uid: data.uid,
              };
            })
          : null,
        providerId: createResult.user.displayName,
        uid: createResult.user.displayName,
      });
      return result;
    } catch (ex) {
      console.log(ex);
      return new Result<IUser>(null, ex.userInfo.message);
    }
  }
  public static async register(username: string, password: string) {
    try {
      const createResult = await auth().createUserWithEmailAndPassword(
        username.trim(),
        password.trim(),
      );
      let result: Result<IUser> = new Result<IUser>({
        displayName: createResult.user.displayName,
        email: createResult.user.email,
        emailVerified: createResult.user.emailVerified,
        isAnonymous: createResult.user.isAnonymous,
        metadata: createResult.user.metadata
          ? {
              creationTime: createResult.user.metadata.creationTime,
              lastSignInTime: createResult.user.metadata.lastSignInTime,
            }
          : null,
        phoneNumber: createResult.user.phoneNumber,
        photoURL: createResult.user.displayName,
        providerData: createResult.user.providerData
          ? createResult.user.providerData.map((data) => {
              return {
                displayName: data.displayName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                photoURL: data.photoURL,
                providerId: data.providerId,
                uid: data.uid,
              };
            })
          : null,
        providerId: createResult.user.displayName,
        uid: createResult.user.displayName,
      });
      return result;
    } catch (ex) {
      console.log(ex);
      return new Result<IUser>(null, ex.userInfo.message);
    }
  }
}
