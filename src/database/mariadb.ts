import { Snowflake } from "discord.js";
import { DataTypes, Model, Sequelize } from "sequelize";

export default new (class Database {
  private db: Sequelize;

  private Settings = class extends Model {};
  private Logging = class extends Model {};

  constructor() {
    if (process.env.DATABASE_URL) {
      this.db = new Sequelize(process.env.DATABASE_URL, {
        logging: false,
      });
    } else {
      this.db = new Sequelize(
        process.env.MARIADB_DATABASE ?? "wissididombot",
        process.env.USER ?? "wissididombot",
        process.env.MARIADB_PASSWORD ?? "wissididombot",
        {
          host: process.env.MARIADB_HOST ?? "db",
          port: parseInt(process.env.MARIADB_PORT ?? "3306"),
          dialect: "mariadb",
          logging: false,
        },
      );
    }
    this.Settings.init(
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
        sequelize: this.db,
        modelName: "settings",
        timestamps: false,
      },
    );
    this.Logging.init(
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
          allowNull: true,
        },
        destinationChannel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: this.db,
        modelName: "settings",
        timestamps: false,
      },
    );
  }

  public async getSettings(
    serverId: Snowflake,
  ): Promise<{ serverId: Snowflake; prefix: string } | null> {
    return (await this.Settings.findOne({
      where: {
        serverId,
      },
    })) as { serverId: Snowflake; prefix: string } | null;
  }

  public async setSettings(settings: { serverId: Snowflake; prefix: string }) {
    let oldSettings = await this.getSettings(settings.serverId);
    if (oldSettings) {
      return await this.Settings.update(settings, {
        where: { serverId: settings.serverId },
      });
    } else {
      return await this.Settings.create(settings);
    }
  }

  public async getLoggings(serverId: Snowflake): Promise<
    {
      serverId: Snowflake;
      event: string;
      sourceChannel: Snowflake;
      destinationChannel: Snowflake;
    }[]
  > {
    return (await this.Logging.findAll({
      where: {
        serverId,
      },
    })) as unknown as {
      serverId: Snowflake;
      event: string;
      sourceChannel: Snowflake;
      destinationChannel: Snowflake;
    }[];
  }

  public async addLogging(logging: {
    serverId: Snowflake;
    event: string;
    sourceChannel: Snowflake | null;
    destinationChannel: Snowflake;
  }) {
    return await this.Logging.create({
      event: logging.event,
      sourceChannel: logging.sourceChannel,
      destinationChannel: logging.destinationChannel,
      serverId: logging.serverId,
    });
  }

  public async addLoggings(
    loggings: {
      serverId: Snowflake;
      event: string;
      sourceChannel: Snowflake;
      destinationChannel: Snowflake;
    }[],
  ) {
    let result = [];
    for (let logging of loggings) {
      result.push(await this.addLogging(logging));
    }
    return result;
  }

  public async removeLogging(logging: {
    serverId: Snowflake;
    event: string;
    sourceChannel: Snowflake;
    destinationChannel: Snowflake;
  }) {
    return await this.Logging.destroy({
      where: {
        serverId: logging.serverId,
        event: logging.event,
        sourceChannel: logging.sourceChannel,
        destinationChannel: logging.destinationChannel,
      },
    });
  }

  public async removeAllLoggings(serverId: Snowflake) {
    return await this.Logging.destroy({
      where: {
        serverId,
      },
    });
  }
})();
