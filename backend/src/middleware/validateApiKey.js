import ApiKey from "../models/ApiKey.js";

/**
 * Validates an API key. Returns true if valid, false otherwise.
 */
export const validateApiKey = async (apiKey) => {
  try {
    if (!apiKey) return false;

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "active"
    }).select("usageToday dailyLimit lastUsageDate userId status key");

    if (!keyDoc) return false;

    // Reset daily usage if a new day
    if (keyDoc.resetDailyUsageIfNewDay) keyDoc.resetDailyUsageIfNewDay();

    // Check quota
    if (keyDoc.usageToday >= keyDoc.dailyLimit) return false;

    // Increase usage count
    keyDoc.usageToday += 1;
    keyDoc.lastUsageDate = new Date();
    await keyDoc.save();

    return true;
  } catch (err) {
    console.error("validateApiKey error:", err);
    return false;
  }
};
