const { Entitlement } = require("discord.js");

/**
 * Emitted whenever an entitlement is updated - i.e. when a user's subscription renews.
 * @param {?Entitlement} oldEntitlement The entitlement before the update
 * @param {Entitlement} newEntitlement The entitlement after the update
 */
async function entitlementUpdate(oldEntitlement, newEntitlement) {
  // TODO
}

module.exports.entitlementUpdate = entitlementUpdate;
