import { DataTypes, Model, Sequelize } from "@sequelize/core";

export default new (class Database {
  #db;

  #Settings = class extends Model {};
  #Birthdays = class extends Model {};
  #Logging = class extends Model {};

  constructor() {}

  async initDb() {
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
        timezone: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Europe/London",
        },
        birthdayWishingChannel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        birthdayWishingMessageWithAge: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        birthdayWishingMessage: {
          type: DataTypes.STRING,
          allowNull: true,
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
        timezone: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Europe/London",
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
          allowNull: true,
        },
        targetChannel: {
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
    let oldPrefix = await this.getPrefix(serverId);
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

  async getTimezone(serverId) {
    let result = await this.#Settings.findOne({
      where: {
        serverId,
      },
    });
    return result?.timezone ?? "Europe/London";
  }

  async setTimezone(serverId, timezone) {
    let oldTimezone = await this.getTimezone(serverId);
    if (oldTimezone) {
      return await this.#Settings.update(
        {
          timezone,
        },
        {
          where: { serverId },
        },
      );
    } else {
      return await this.#Settings.create({
        serverId,
        timezone,
      });
    }
  }

  async getBirthdayWishingChannel(serverId = null) {
    if (serverId) {
      return (
        (
          await this.#Settings.findOne({
            where: {
              serverId,
            },
          })
        )?.birthdayWishingChannel ?? null
      );
    } else {
      let settings = await this.#Settings.findAll();
      if (!settings) return null;
      let birthdayWishingChannels = {};
      for (let setting of settings) {
        birthdayWishingChannels[setting.serverId] =
          setting.birthdayWishingChannel;
      }
      return birthdayWishingChannels;
    }
  }

  async setBirthdayWishingChannel(serverId, channelId) {
    let oldBirthdayWishingChannel =
      await this.getBirthdayWishingChannel(serverId);
    if (oldBirthdayWishingChannel) {
      return await this.#Settings.update(
        {
          birthdayWishingChannel: channelId,
        },
        {
          where: { serverId },
        },
      );
    } else {
      return await this.#Settings.create({
        serverId,
        birthdayWishingChannel: channelId,
      });
    }
  }

  async getBirthdayWishingMessage(serverId = null) {
    if (serverId) {
      let birthdaySetting = await this.#Settings.findOne({
        where: {
          serverId,
        },
      });
      let result = null;
      if (birthdaySetting) {
        result = {
          birthdayWishingMessageWithAge:
            birthdaySetting.birthdayWishingMessageWithAge,
          birthdayWishingMessage: birthdaySetting.birthdayWishingMessage,
        };
      }
      return result;
    } else {
      let settings = await this.#Settings.findAll();
      if (!settings) return null;
      let birthdayWishingMessages = {};
      for (let setting of settings) {
        birthdayWishingMessages[setting.serverId] = {
          birthdayWishingMessageWithAge:
            setting.birthdayWishingMessageWithAge ??
            "It's <userMention>'s birithday today (<age>)!",
          birthdayWishingMessage:
            setting.birthdayWishingMessage ??
            "It's <userMention>'s birithday today!",
        };
      }
      return birthdayWishingMessages;
    }
  }

  async setBirthdayWishingMessage(serverId, messageWithAge, message) {
    let oldBirthdayWishingMessage =
      await this.getBirthdayWishingMessage(serverId);
    if (oldBirthdayWishingMessage) {
      return await this.#Settings.update(
        {
          birthdayWishingMessageWithAge: messageWithAge,
          birthdayWishingMessage: message,
        },
        {
          where: { serverId },
        },
      );
    } else {
      return await this.#Settings.create({
        serverId,
        birthdayWishingMessageWithAge: messageWithAge,
        birthdayWishingMessage: message,
      });
    }
  }

  async getBirthday(serverId, userId) {
    return await this.#Birthdays.findOne({
      where: {
        serverId,
        userId,
      },
    });
  }

  async getBirthdays(serverId = null) {
    if (serverId) {
      return await this.#Birthdays.findAll({
        where: {
          serverId,
        },
      });
    } else {
      return await this.#Birthdays.findAll();
    }
  }

  async setBirthday(serverId, userId, year, month, day, timezone) {
    let oldBirthday = await this.getBirthday(serverId, userId);
    if (oldBirthday) {
      return await this.#Birthdays.update(
        {
          year,
          month,
          day,
          timezone,
        },
        {
          where: {
            serverId,
            userId,
          },
        },
      );
    }
    return await this.#Birthdays.create({
      serverId,
      userId,
      year,
      month,
      day,
      timezone,
    });
  }

  async deleteBirthday(serverId, userId) {
    return await this.#Birthdays.destroy({
      where: {
        serverId,
        userId,
      },
    });
  }

  async getLoggings(serverId = null, event = null) {
    if (serverId) {
      if (event) {
        return await this.#Logging.findAll({
          where: {
            serverId,
            event,
          },
        });
      } else {
        return await this.#Logging.findAll({
          where: {
            serverId,
          },
        });
      }
    } else {
      return await this.#Logging.findAll();
    }
  }

  async setLogging(serverId, event, sourceChannel, targetChannel) {
    let oldLoggings = await this.getLoggings(serverId);
    for (let oldLogging of oldLoggings) {
      if (oldLogging && oldLogging.event == event) {
        return await this.#Logging.update(
          {
            sourceChannel,
            targetChannel,
          },
          {
            where: {
              serverId,
              event,
            },
          },
        );
      }
    }
    return await this.#Logging.create({
      serverId,
      event,
      sourceChannel,
      targetChannel,
    });
  }

  async deleteLogging(serverId, event, sourceChannel, targetChannel) {
    return await this.#Logging.destroy({
      where: {
        serverId,
        event,
        sourceChannel: sourceChannel ?? null,
        targetChannel,
      },
    });
  }
})();
