const jwt = require('jsonwebtoken')

const generarJWT = (uid = '')=> {

    return new Promise((resolve, reject)=> {

        const payload = {uid}

        jwt.sign(payload, process.env.SECRETPRIVATEKEYJWT, {
            expiresIn: '4h',
        },(error, token)=> {

            if(error){
                console.log(error);
                reject('No se pude generar el token');
            }else{
                resolve(token);
            }
        })

    })


}

module.exports = generarJWT;
