export const logAccessEvent = async ({
  userId,
  name,
  role,
  status,
  reason = '',
  location,
  accessedAt = new Date(),
}) => {
  try {
    const log = new AccessLog({
      userId,
      name,
      role,
      status,
      reason,
      location,
      accessedAt,
    });

    await log.save();
    console.log('Access log saved.');
    return log;
  } catch (error) {
    console.error('Error saving access log:', error);
    throw error;
  }
};
