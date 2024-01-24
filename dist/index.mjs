// src/function.ts
import { Sequelize } from "sequelize";
var TimeScaleSequalize = class extends Sequelize {
  constructor(options) {
    super(options);
  }
  async addConstraint(table, constraintName, constraint1, constraint2) {
    try {
      if (constraint2) {
        await this.query(
          `
            ALTER TABLE public.${table}
            ADD CONSTRAINT ${constraintName} UNIQUE ("${constraint1}", "${constraint2}");
            `,
          {
            raw: true
          }
        );
      } else {
        await this.query(
          `
              ALTER TABLE public.${table}
              ADD CONSTRAINT ${constraintName} UNIQUE ("${constraint1}");
              `,
          {
            raw: true
          }
        );
      }
    } catch (err) {
      throw err;
    }
  }
  async createHyperTable(table, constraint, interval) {
    try {
      if (interval) {
        await this.query(
          `SELECT create_hypertable('${table}', '${constraint}', chunk_time_interval => INTERVAL '${interval.toString()} hour');`,
          {
            raw: true
          }
        );
      } else {
        await this.query(
          `SELECT create_hypertable('${table}', '${constraint}');`,
          {
            raw: true
          }
        );
      }
    } catch (err) {
      throw err;
    }
  }
};
export {
  TimeScaleSequalize
};
//# sourceMappingURL=index.mjs.map