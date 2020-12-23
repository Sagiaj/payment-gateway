import mysql, { OkPacket } from "mysql";

export default class BaseMySQLProvider {
  private static _pool_cluster: mysql.PoolCluster;

  static get pool_cluster() {
    if (!this._pool_cluster) {
      
      const cluster = mysql.createPoolCluster();
      cluster.add(Globals.mysql_config.master_connection.connection_name, Globals.mysql_config.master_connection);
      for (let connection_options of Globals.mysql_config.read_replica_connections) {
        cluster.add(connection_options.connection_name, connection_options);
      }
      // this._pool_cluster = mysql.createPool({
      //   connectionLimit: Globals.mysql_config.connectionLimit,
      //   host: Globals.mysql_config.host,
      //   user: Globals.mysql_config.user,
      //   port: Globals.mysql_config.port,
      //   password: Globals.mysql_config.password,
      //   database: Globals.mysql_config.database
      // });
    }

    return this._pool_cluster;
  }

  static async getReadReplicaPoolConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, rejects) => {
      this.pool_cluster.of(Globals.mysql_config.read_replica_connections[0].connection_name).getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, rejects);
        }
        return resolve(connection);
      });
    });
  }

  static async getMasterPoolConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, rejects) => {
      this.pool_cluster.of(Globals.mysql_config.master_connection.connection_name).getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, rejects);
        }
        return resolve(connection);
      });
    });
  }

  static async handlePoolError(correlation_id: string, err: NodeJS.ErrnoException, rejects: any) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      AppLogger.error(correlation_id, 'Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        AppLogger.error(correlation_id, 'Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
        AppLogger.error(correlation_id, 'Database connection was refused.')
    }
    return rejects(err);
  }

  static async getConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, rejects) => {
      this.pool_cluster.getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, rejects);
        }
        return resolve(connection);
      })
    });
  }

  static async executeQueryOkPacket(correlation_id: string, sql: string, values?: (string | number)[]): Promise<OkPacket| OkPacket[] | OkPacket[][]> {
    return new Promise(async (resolve, rejects) => {
      (await this.getReadReplicaPoolConnection(correlation_id)).query({ sql, values }, async (err, results, fields) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, rejects);
        }
        return resolve(results);
      })
    })
  }

  static async executeQueryRowDataPacket(correlation_id: string, sql: string, values?: (string | number)[]) {
    return new Promise(async (resolve, rejects) => {
      (await this.getMasterPoolConnection(correlation_id)).query({ sql, values }, async (err, results, fields) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, rejects);
        }
        return resolve(results);
      })
    })
  }
}
