const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
    // Verificar si el encabezado 'Authorization' está presente
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Obtener el token del encabezado de autorización
    const token = req.headers.authorization.replace('Bearer ', '');
    
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Establecer el usuario decodificado en el objeto de solicitud
        req.user = decoded;
        
        // Llamar al siguiente middleware
        next();
    } catch (error) {
        // Manejar errores de verificación de token
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { auth };
