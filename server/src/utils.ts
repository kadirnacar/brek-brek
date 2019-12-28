import * as fs from 'fs';
import * as path from 'path';

import { MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual } from "typeorm";
import { format } from "date-fns";

export interface FileInfo {
    fileName: string;
    path: string;
    fullPath: string;
}

export default class Utils {
    public static getFiles(pathName): FileInfo[] {
        const result: FileInfo[] = [];
        if (fs.existsSync(pathName)) {
            if (fs.lstatSync(pathName).isDirectory()) { // recurse
                fs.readdirSync(pathName).forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    result.push({
                        fileName: file,
                        fullPath: path.join(pathName, file),
                        path: pathName
                    });
                });
            } else { // delete file
            }
        }
        return result;
    }
    public static deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            if (fs.lstatSync(path).isDirectory()) { // recurse
                fs.readdirSync(path).forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        Utils.deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            } else { // delete file
                fs.unlinkSync(path);
            }
        }
    }
    public static isEmpty(obj) {
        if (!obj)
            return true;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    public static renameFolder(oldName, newName) {
        fs.renameSync(oldName, newName);
    }

    public static checkFileExists(path) {
        return fs.existsSync(path);
    }
    public static mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';

        return targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (err) {
                if (err.code === 'EEXIST') { // curDir already exists!
                    return curDir;
                }

                // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
                if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }

                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                    throw err; // Throw if it's just the last created dir.
                }
            }

            return curDir;
        }, initDir);
    }
}

// TypeORM query operators polyfills
enum EDateType {
  Date = "yyyy-MM-dd",
  Datetime = "yyyy-MM-dd hh:mm:ss"
};

const MoreThanDate = (date: Date, type: EDateType) => MoreThan(format(date, type));
const MoreThanOrEqualDate = (date: Date, type: EDateType) => MoreThanOrEqual(format(date, type));
const LessThanDate = (date: Date, type: EDateType) => LessThan(format(date, type));
const LessThanOrEqualDate = (date: Date, type: EDateType) => LessThanOrEqual(format(date, type));

export { MoreThanDate, MoreThanOrEqualDate, LessThanDate, LessThanOrEqualDate, EDateType };
