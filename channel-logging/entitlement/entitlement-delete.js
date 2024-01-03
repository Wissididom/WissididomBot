const { Entitlement } = require('discord.js');

/**
 * Emitted whenever an entitlement is deleted.
 * 
 * Entitlements are not deleted when they expire. This is only triggered when Discord issues a refund or deletes the entitlement manually
 * @param {Entitlement} entitlement The entitlement that was deleted
 */
async function entitlementDelete(entitlement) {
    // TODO
}

module.exports.entitlementDelete = entitlementDelete;
