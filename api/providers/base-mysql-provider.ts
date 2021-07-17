import mysql, { PoolConnection, OkPacket } from "mysql";
import { ErrorCodes } from "../error-codes";

export default class BaseMySQLProvider {
  private static _pool_cluster: mysql.PoolCluster;

  static get pool_cluster() {
    if (!this._pool_cluster) {

      const cluster = mysql.createPoolCluster();
      const additionalPoolConfig = {
        multipleStatements: true,
        bigNumberStrings: true,
        charset: "utf8"
      };
      cluster.add("MASTER", {
        ...Globals.mysql_config.master_connection,
        ...additionalPoolConfig
      });
      let rrIdx = 1;
      for (let connection_options of Globals.mysql_config.read_replica_connections) {
        cluster.add(`READONLY${rrIdx}`, {
          ...connection_options,
          ...additionalPoolConfig
        });
        rrIdx++;
      }
      this._pool_cluster = cluster;
    }

    return this._pool_cluster;
  }

  static async getReadReplicaPoolConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool_cluster.of("READONLY*").getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, reject);
        }
        return resolve(connection);
      });
    });
  }

  static async getMasterPoolConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool_cluster.of("MASTER").getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, reject);
        }
        return resolve(connection);
      });
    });
  }

  static async handlePoolError(correlation_id: string, err: NodeJS.ErrnoException, reject: any) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      AppLogger.error(correlation_id, 'Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      AppLogger.error(correlation_id, 'Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      AppLogger.error(correlation_id, 'Database connection was refused.')
    }
    return reject(err);
  }

  static async getConnection(correlation_id: string): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool_cluster.getConnection(async (err, connection) => {
        if (err) {
          return await this.handlePoolError(correlation_id, err, reject);
        }
        return resolve(connection);
      })
    });
  }

  static async executeQueryOkPacket(correlation_id: string, sql: string, values?: (string | number)[]): Promise<OkPacket | OkPacket[] | OkPacket[][]> {
    const method_name = "BaseMySQLProvider/executeQueryOkPacket";
    AppLogger.info(correlation_id, `${method_name} - start`);
    return new Promise(async (resolve, reject) => {
      try {
        return (await this.getReadReplicaPoolConnection(correlation_id)).query({ sql, values }, async (err, results, fields) => resolve(this.handleQueryResponse(correlation_id, err, results)));
      } catch (err_rej) {
        AppLogger.error(correlation_id, `${method_name} - error:`, err_rej);
        return reject(err_rej);
      }
    });
  }

  static async executeQueryRowDataPacket(correlation_id: string, sql: string, values?: (string | number)[]) {
    const method_name = "BaseMySQLProvider/executeQueryRowDataPacket";
    AppLogger.info(correlation_id, `${method_name} - start`);
    return new Promise(async (resolve, reject) => {
      try {
        return (await this.getMasterPoolConnection(correlation_id)).query({ sql, values }, async (err, results, fields) => resolve(this.handleQueryResponse(correlation_id, err, results)));
      } catch (err_rej) {
        AppLogger.error(correlation_id, `${method_name} - error:`, err_rej);
        return reject(err_rej);
      }
    })
  }

  static async handleQueryResponse(correlation_id: string, err_query, result): Promise<any> {
    const method_name = "BaseMySQLProvider/handleQueryResponse";
    AppLogger.silly(correlation_id, `${method_name} - start`);

    if (err_query) {
      AppLogger.error(correlation_id, `${method_name} - error;`, err_query);
      return Promise.reject(err_query);
    } else {
      let results = result;
      if (result.length > 1) {
        results = result.filter(res => res.hasOwnProperty("affectedRows") == true);
      }
      let results_length = 0;
      try {
        if (results && results.length > 0) {
          results_length = results.reduce((count, row) => {
            return count + (row && row.length ? row.length : 0);
          }, results.length);
        }
      } catch (err) { }

      return results;
    }
  }

  static async commitTransaction(correlation_id: string, connection: PoolConnection): Promise<boolean> {
    const method_name = "BaseMySQLProvider/commitTransaction";
    AppLogger.info(correlation_id, `${method_name} - start`);

    return new Promise((resolve, reject) => {
      try {
        connection.commit(err => {
          if (err) {
            AppLogger.error(correlation_id, `${method_name} - failed committing transaction. error:`, err);
            return this.rollbackTransaction(correlation_id, connection);
          } else {
            AppLogger.silly(correlation_id, `${method_name} - release connection`);
            connection.release();
            AppLogger.silly(correlation_id, `${method_name} - end`);
            return resolve(true);
          }
        });
      } catch (err) {
        AppLogger.error(correlation_id, `${method_name} - failed to commit transaction. Rolling back. error:`, err);
        return this.rollbackTransaction(correlation_id, connection);
      }
    })
  }

  static async rollbackTransaction(correlation_id: string, connection: PoolConnection): Promise<boolean> {
    const method_name = "BaseMySQLProvider/rollbackTransaction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    return new Promise((resolve, reject) => {
      try {
        if (connection) {
          connection.rollback(() => {
            try {
              AppLogger.silly(correlation_id, `${method_name} - releasing connection`);
              connection.release();
            } catch (error) {
              AppLogger.error(correlation_id, `${method_name} - failed to release connection. error:`, error);
            }
            return resolve(true);
          })
        } else {
          AppLogger.error(correlation_id, `${method_name} - failed to rollback connection. Connection passed is NULL`);
          return reject(ErrorCodes.ERROR_ROLLBACK_NULL_CONNECTION);
        }
      } catch (err) {
        AppLogger.error(correlation_id, `${method_name} - error:`, err);
        return reject(true);
      }
    });
  }
}
