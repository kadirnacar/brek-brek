import {Result} from '@models';
import {log} from '@utils';
import jsonToUrl from 'json-to-url';
import * as LocalStorage from '../store/localStorage';

export interface IRequestOptions {
  url: string;
  data?: any;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

/**
 * Represents base class of the isomorphic service.
 */
export abstract class ServiceBase {
  /**
   * Make request with JSON data.
   * @param opts
   */
  public static async requestJson<T>(
    opts: IRequestOptions,
    setAuthHeader: boolean = true,
  ): Promise<Result<T>> {
    var axiosResult = null;
    let result: Result<T> = null;

    // opts.url = transformUrl(opts.url); // Allow requests also for Node.

    var processQuery = (url: string, data: any): string => {
      if (data) {
        return `${url}?${jsonToUrl(data)}`;
      }
      return url;
    };

    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (setAuthHeader) {
      const token = await LocalStorage.getItem('token');
      headers.auth = token;
    }
    try {
      switch (opts.method) {
        case 'GET':
          axiosResult = await (
            await fetch(processQuery(opts.url, opts.data), {
              method: 'GET',
              headers,
              body: null,
            })
          ).json();

          break;
        case 'POST':
          axiosResult = await (
            await fetch(opts.url, {
              method: 'POST',
              headers,
              body: JSON.stringify(opts.data),
            })
          ).json();
          break;
        case 'PUT':
          axiosResult = await (
            await fetch(opts.url, {
              method: 'PUT',
              headers,
              body: JSON.stringify(opts.data),
            })
          ).json();
          break;
        case 'PATCH':
          axiosResult = await (
            await fetch(opts.url, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(opts.data),
            })
          ).json();
          break;
        case 'DELETE':
          axiosResult = await (
            await fetch(processQuery(opts.url, opts.data), {
              method: 'DELETE',
              headers,
              body: null,
            })
          ).json();
          break;
      }

      result = new Result<T>(axiosResult, null);
    } catch (error) {
      console.log(error, opts);
      log.error(error);
      result = new Result<T>(
        null,
        // opts.url +
        // ' - ' +
        error.response && error.response.data
          ? error.response.data
          : error.message,
      );
    }

    if (result.hasErrors) {
      // Ui.showErrors(result.errors);
      // console.log(result)
      // if (result.errors[0].indexOf("401") > -1 && window.location.href.indexOf("login") == -1) {
      //     window.location.href = "/";
      // }
    }
    return result;
  }
}
