const jwt = require('jsonwebtoken');
const User = require('../models/User');

const permissions = {
  viewer: ["read"],
  analyst: ["read", "summary"],
  admin: ["read", "summary", "create", "update", "delete", "manage_users"]
};

// Protect routes (Authentication)
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ success: false, message: 'Not authorized to access this route' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user || req.user.status === 'inactive') {
            return res.status(401).json({ success: false, message: 'Not authorized or account inactive' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Policy based authorization (RBAC strict check)
exports.authorize = (action) => {
  return (req, res, next) => {
    // 🔥 QUICK DEBUG (VERY IMPORTANT)
    console.log("USER ROLE:", req.user ? req.user.role : "undefined");
    console.log("ACTION:", action);

    const role = req.user.role;
    
    if (!permissions[role] || !permissions[role].includes(action)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden" // Explicit standard response matching requirement exactly
      });
    }
    
    next();
  };
};
