import * as shortid from 'shortid';
import { Connection, ConnectionOptions, createConnection, DefaultNamingStrategy, EntitySchema, NamingStrategyInterface } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return targetName;
    }
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return embeddedPrefixes.concat(customName ? customName : propertyName).join("_");
    }

    columnNameCustomized(customName: string): string {
        return customName;
    }

    relationName(propertyName: string): string {
        return propertyName;
    }
    relationConstraintName(tableOrName: string, columnNames: string[], where?: string) {
        return "FK_" + tableOrName + "_" + columnNames.join("_") + "_" + shortid.generate();
    }
    uniqueConstraintName(tableOrName: string, columnNames: string[]): string {
        return "FK_" + tableOrName + "_" + columnNames.join("_") + "_" + shortid.generate();
    }
    checkConstraintName(tableOrName: string, expression: string): string {
        return "FK_" + tableOrName + "_" + expression + "_" + shortid.generate();
    }
    defaultConstraintName(tableOrName: string, columnName: string): string {
        return "FK_" + tableOrName + "_" + columnName + "_" + shortid.generate();
    }
}

export class TypeOrmManager {
    private static connections: Connection[] = [];

    public static async createConnection(info: any, entities?: EntitySchema<any>[]): Promise<Connection> {
        let options: ConnectionOptions = {
            entities: entities,
            namingStrategy: new CustomNamingStrategy(),
            ...info
        }

        // switch (info.type) {
        //     case type.MsSql:
        //         options = {
        //             type: "mssql",
        //             database: info.database,
        //             host: info.host,
        //             username: info.username,
        //             name: info.name,
        //             password: info.password,
        //             entities: entities,
        //             namingStrategy: new CustomNamingStrategy()
        //         }
        //         break;
        //     case type.MySql:
        //         options = {
        //             type: "mysql",
        //             database: info.database,
        //             host: info.host,
        //             username: info.username,
        //             name: info.name,
        //             password: info.password,
        //             entities: entities,
        //             namingStrategy: new CustomNamingStrategy()
        //         }
        //         break;
        // }
        const connIndex = this.connections.findIndex(cn => cn.name == info.name);
        if (connIndex > -1) {
            await this.connections[connIndex].close();
            this.connections.splice(connIndex, 1);
        }

        const conn: Connection = await createConnection(options);
        this.connections.push(conn);
        return conn;
    }

    public static async getConnectionByName(name: string): Promise<Connection> {
        const conn: Connection = this.connections.find(cn => cn.name == name);
        return conn;
    }

    public static async getConnection(info: any, reCreate?: boolean): Promise<Connection> {
        var conn: Connection = this.connections.find(cn => cn.name == info.name);
        if (!conn || reCreate == true)
            conn = await this.createConnection(info);
        return conn;
    }
}