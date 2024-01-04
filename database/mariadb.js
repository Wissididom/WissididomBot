const { Sequelize, Model, DataTypes } = require("sequelize");

class Database {
  #db = null;

  #Settings = class extends Model {};

  constructor() {
    if (process.env.DATABASE_URL) {
      this.#db = new Sequelize(process.env.DATABASE_URL, {
        logging: false,
      });
    } else {
      this.#db = new Sequelize(
        process.env.MARIADB_DATABASE ?? "wissididombot",
        process.env.MARIADB_USER ?? "wissididombot",
        process.env.MARIADB_PASSWORD ?? "wissididombot",
        {
          host: process.env.MARIADB_HOST ?? "db",
          port: parseInt(process.env.MARIADB_PORT ?? "3306"),
          dialect: "mariadb",
          logging: false,
        },
      );
    }
    this.#Settings.init(
      {
        serverId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        prefix: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "!",
        },
      },
      {
        sequelize: this.#db,
        modelName: "settings",
        timestamps: false,
      },
    );
  }

  async getSettings(serverId) {
    return await this.#Settings.findOne({
      where: {
        serverId,
      },
    });
  }

  async setSettings(serverId, settings) {
    let settings = await this.getSettings(serverId);
    if (settings) {
      return await this.#Settings.update(settings, { where: { serverId } });
    } else {
      return await this.#Settings.create(settings);
    }
  }
}

module.exports.Database = Database;
