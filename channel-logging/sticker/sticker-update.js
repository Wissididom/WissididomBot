const { Sticker } = require('discord.js');

/**
 * Emitted whenever a custom sticker is updated in a guild.
 * @param {Sticker} oldSticker The old sticker
 * @param {Sticker} newSticker The new sticker
 */
async function stickerUpdate(oldSticker, newSticker) {
    // TODO
}

module.exports.stickerUpdate = stickerUpdate;
