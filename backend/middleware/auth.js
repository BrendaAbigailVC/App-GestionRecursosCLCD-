const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    //Nota: En producción aquí se deberia validar la firma con la clave pública de Keycloak 
    //por ahora, decodificamos el token para extraer la identidad
    try {
        const decoded = jwt.decode(token);
        if (!decoded) throw new Error();
        
        //todo el objeto
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

module.exports = verifyToken;