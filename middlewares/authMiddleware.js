// Mock authentication middleware for development
// In a real application, you would use JWT, sessions, or other auth methods

// Mock user data
const mockUsers = {
  1: { id: 1, role: 'staff', full_name: 'Staff User' },
  2: { id: 2, role: 'donor', full_name: 'Donor User' }
};

// Authentication middleware
const authenticate = (req, res, next) => {
  // Mock authentication - in real app, verify JWT token or session
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  // Mock token validation - assume token format: "Bearer userId"
  const token = authHeader.replace('Bearer ', '');
  const userId = parseInt(token);
  
  if (!mockUsers[userId]) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Add user to request object
  req.user = mockUsers[userId];
  next();
};

// Authorization middleware
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
}; 