import config from '@config';
import {IUser, Result} from '@models';
import {ServiceBase} from './ServiceBase';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: config.googleWebApiKey, // From Firebase Console Settings
});
export class UserService extends ServiceBase {
  public static async loginWithEmail(username: string, password: string) {
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
  public static async loginWithGoogle() {
    try {
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const createResult = await auth().signInWithCredential(googleCredential);
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
      return new Result<IUser>(null, ex.message);
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
