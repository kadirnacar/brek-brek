import {NativeModules} from 'react-native';
import {logger} from 'react-native-logs';
import {rnFsFileAsync} from 'react-native-logs/dist/transports/rnFsFileAsync';
import * as RNFS from 'react-native-fs';

const defaultConfig = {
  transport: rnFsFileAsync,
  transportOptions: {
    dateFormat: 'iso',
    loggerName: 'brekbrek-logs',
    loggerPath: RNFS.DownloadDirectoryPath,
  },
  levels: {
    trace: 0,
    info: 1,
    silly: 2,
    error: 3,
    mad: 4,
    timer: 5,
  },
};

export const log = logger.createLogger(defaultConfig);
declare var process: any;
const Aes = NativeModules.Aes;

export const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

export const encryptData = (text, key) => {
  return Aes.randomKey(16).then((iv) => {
    return Aes.encrypt(text, key, iv).then((cipher) => ({
      cipher,
      iv,
    }));
  });
};

export const decryptData = (encryptedData, key) =>
  Aes.decrypt(encryptedData.cipher, key, encryptedData.iv);

export function clone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Is server prerendering by Node.js.
 * There can't be any DOM: window, document, etc.
 */
export function isNode(): boolean {
  return (
    typeof process === 'object' && process.versions && !!process.versions.node
  );
}

export function isObjectEmpty(obj): boolean {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export const enumVales = (myEnum): string[] => {
  let result: string[] = [];
  for (var enumMember in myEnum) {
    var isValueProperty = parseInt(enumMember, 10) >= 0;
    if (isValueProperty) {
      result.push(myEnum[enumMember]);
    }
  }
  return result;
};
export const arrayToObject = (array, key, value) => {
  if (!array) return {};
  return array.reduce((obj, item) => {
    obj[item[key]] = item[value];
    return obj;
  }, {});
};

export const performTimeConsumingTask = async () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('result');
    }, 3000),
  );
};
