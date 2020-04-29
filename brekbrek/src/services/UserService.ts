import config from '@config';
import {IUser, Result} from '@models';
import {ServiceBase} from './ServiceBase';
import {GoogleSignin} from '@react-native-community/google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

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
      console.log(appUser)
      const result = await this.requestJson<any>(
        {
          url: `${config.restUrl}/api/auth/google`,
          method: 'POST',
          data: appUser,
        },
        false,
      );

      return result;
    } catch (ex) {
      console.log(ex);
      return new Result<IUser>(null, ex.message);
    }
  }
  public static async loginWithFacebook() {
    try {
      const loginResult = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      // if (!loginResult.isCancelled && !loginResult.error) {
      const accessToken = await AccessToken.getCurrentAccessToken();
      const loginInfoResult: any = await new Promise((resolve, reject) => {
        let req = new GraphRequest(
          '/me',
          {
            httpMethod: 'GET',
            accessToken: accessToken.accessToken,
            parameters: {
              fields: {
                string: 'email,name',
              },
            },
          },
          (err, result) => {
            resolve(result);
          },
        );
        new GraphRequestManager().addRequest(req).start();
      });
      console.log(loginInfoResult);
      // }
      const appUser: IUser = {
        DisplayName: loginInfoResult.name,
        Email: loginInfoResult.email,
        Type: 'Facebook',
        Uid: loginInfoResult.id,
      };
      console.log(appUser)
      const result = await this.requestJson<any>(
        {
          url: `${config.restUrl}/api/auth/facebook`,
          method: 'POST',
          data: appUser,
        },
        false,
      );

      return result;
    } catch (ex) {
      console.log(ex);
      return new Result<IUser>(null, ex.message);
    }
  }
}
