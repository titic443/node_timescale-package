import { Dialect, QueryOptions, Sequelize } from "sequelize";

interface CustomSequalizeOpt {
  dialect?: Dialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  query?: QueryOptions;
}

export class TimeScaleSequalize extends Sequelize {
  constructor(options?: CustomSequalizeOpt) {
    super(options);
  }

  async addConstraint(
    table: string,
    constraintName: string,
    constraint1?: string,
    constraint2?: string
  ) {
    try {
      if (constraint2) {
        await this.query(
          `
            ALTER TABLE public.${table}
            ADD CONSTRAINT ${constraintName} UNIQUE ("${constraint1}", "${constraint2}");
            `,
          {
            raw: true,
          }
        );
      } else {
        await this.query(
          `
              ALTER TABLE public.${table}
              ADD CONSTRAINT ${constraintName} UNIQUE ("${constraint1}");
              `,
          {
            raw: true,
          }
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async createHyperTable(table: string, constraint: string, interval?: number) {
    try {
      if (interval) {
        await this.query(
          `SELECT create_hypertable('${table}', '${constraint}', chunk_time_interval => INTERVAL '${interval.toString()} hour');`,
          {
            raw: true,
          }
        );
      } else {
        await this.query(
          `SELECT create_hypertable('${table}', '${constraint}');`,
          {
            raw: true,
          }
        );
      }
    } catch (err) {
      throw err;
    }
  }
}
