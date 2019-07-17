const jwt = require('jsonwebtoken');


//==================================
// Verificar Token
//==================================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            });

        } else {
            res.usuario = decoded.usuario;
            next();

        }

    });
};

let verificaAdmin_Role = (req, res, next) => {

    let role = req.usuario.role;

    if (role === 'ADMIN_ROLE') {

        next();

    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }




};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}