import config from '@config';
import {IUser, Result} from '@models';
import {ServiceBase} from './ServiceBase';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: config.googleWebClientId,
  forceCodeForRefreshToken: true,
});
export class UserService extends ServiceBase {
  public static async loginWithGoogle() {
    try {
      const user = await GoogleSignin.signIn();
      const appUser: IUser = {
        DisplayName: user.user.name,
        Email: user.user.email,
        Type: 'Google',
        Uid: user.user.id,
      };
      const result = await this.requestJson<any>(
        {
          url: `${config.restUrl}/api/auth/google`,
          method: 'POST',
          data: appUser,
        },
        false
      );

      return result;
    } catch (ex) {
      console.log(ex);
      return new Result<IUser>(null, ex.message);
    }
  }
}
