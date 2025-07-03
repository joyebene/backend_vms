export default function checkGroupAccess(requiredGroups) {
  return (req, res, next) => {
    const userGroups = req.user?.groups || [];
    const hasAccess = requiredGroups.some(group => userGroups.includes(group));
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });
    next();
  };
};
