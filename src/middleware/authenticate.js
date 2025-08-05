import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status:401,
            error: true,
            message: 'No token provided, authorization denied',
            data: {}
        });
    }

  

    // Extract the token
    const token = authHeader.split(' ')[1];
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload to req
        // console.log(req.user,"checck token");w
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({
            status:401,
            message: 'Invalid or expired token',
            error: true,
            message: err.message,
            data: {}
        });
    }
};

export default authenticate;
   