import { Sequelize, Model, DataTypes } from "sequelize";

export class Database {
  #db = null;

  #Settings = class extends Model {};
  #Logging = class extends Model {};

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
    this.#Logging.init(
      {
        serverId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        event: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sourceChannel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        destinationChannel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: this.#db,
        modelName: "logging",
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
    let oldSettings = await this.getSettings(serverId);
    if (oldSettings) {
      return await this.#Settings.update(settings, { where: { serverId } });
    } else {
      return await this.#Settings.create(settings);
    }
  }

  async getLoggings(serverId) {
    return await this.#Logging.findAll({
      where: {
        serverId,
      },
    });
  }

  async addLogging(serverId, logging) {
    return await this.#Logging.create(
      {
        event: logging.event,
        sourceChannel: logging.sourceChannel,
        destinationChannel: logging.destinationChannel,
      },
      {
        where: {
          serverId,
        },
      },
    );
  }

  async addLoggings(serverId, loggings) {
    let result = [];
    for (let logging of loggings) {
      result.push(await this.addLogging(serverId, logging));
    }
    return result;
  }

  async removeLogging(serverId, logging) {
    return await this.#Logging.destroy({
      where: {
        serverId,
        event: logging.event,
        sourceChannel: logging.sourceChannel,
        destinationChannel: logging.destinationChannel,
      },
    });
  }

  async removeAllLoggings(serverId) {
    return await this.#Logging.destroy({
      where: {
        serverId,
      },
    });
  }
}
