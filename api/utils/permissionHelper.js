import { decodeAccessToken } from './token.js';

// Helper function to require a valid access token
export function requireAccessToken(req, res, next) {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { userRole } = decodeAccessToken(accessToken);
    
    if (!userRole) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // Add user role to request for use in handlers
    req.userRole = userRole;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

// Helper function to check if user has one of the roles
export function requireRole(permittedRoles) {
  return (req, res, next) => {
    requireAccessToken(req, res, () => {
      const userRole = req.userRole;  // set in requireAccessToken

      if (!permittedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions', 
          required: permittedRoles,
          current: userRole 
        });
      }
      next();
    });
  };
}
