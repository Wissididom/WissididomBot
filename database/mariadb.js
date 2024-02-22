import { DataTypes, Model, Sequelize } from "@sequelize/core";

export default new (class Database {
  #db;

  #Settings = class extends Model {};
  #Birthdays = class extends Model {};
  #Logging = class extends Model {};

  constructor() {
    if (process.env.DATABASE_URL) {
      this.#db = new Sequelize(process.env.DATABASE_URL, {
        logging: false,
      });
    } else {
      this.#db = new Sequelize(
        process.env.MARIADB_DATABASE ?? "wissididombot",
        process.env.MARIADB_USERNAME ?? "wissididombot",
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
    this.#Birthdays.init(
      {
        serverId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: true,
          min: 1900,
          max: 2999,
        },
        month: {
          type: DataTypes.INTEGER,
          allowNull: false,
          min: 1,
          max: 12,
        },
        day: {
          type: DataTypes.INTEGER,
          allowNull: false,
          min: 1,
          max: 31,
        },
      },
      {
        sequelize: this.#db,
        modelName: "birthdays",
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
        modelName: "settings",
        timestamps: false,
      },
    );
    this.initDb();
  }

  async initDb() {
    await this.#Settings.sync({ alter: true });
    await this.#Birthdays.sync({ alter: true });
    await this.#Logging.sync({ alter: true });
  }

  async getPrefix(serverId) {
    let result = await this.#Settings.findOne({
      where: {
        serverId,
      },
    });
    return result?.prefix ?? null;
  }

  async setPrefix(serverId, prefix) {
    let oldPrefix = await this.getPrefix(settings.serverId);
    if (oldPrefix) {
      return await this.#Settings.update(
        {
          prefix,
        },
        {
          where: { serverId },
        },
      );
    } else {
      return await this.#Settings.create({
        serverId,
        prefix,
      });
    }
  }

  async getBirthday(serverId, userId) {
    let result = await this.#Birthdays.findOne({
      where: {
        serverId,
        userId,
      },
    });
    return result;
  }

  async setBirthday(serverId, userId, year, month, day) {
    return await this.#Birthdays.upsert({
      serverId,
      userId,
      year,
      month,
      day,
    });
  }
})();
