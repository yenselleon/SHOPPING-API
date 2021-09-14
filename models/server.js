const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/db.config.js');


class Server {

    constructor(){
        
        this.app = express();

        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a la base de datos mongoose
        this.conectarDB();

        //middlewares
        this.middlewares();

        //routes
        this.routes();
    }

    async conectarDB(){
        await dbConection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Lectura y Parseo del Body
        this.app.use(express.json());

        //Directorio Público
        this.app.use( express.static('public'));

    }

    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios.routes.js'))

    }


    listen(){
        this.app.listen(this.port, ()=> {
            console.log('La aplicacion esta disponible desde el puerto', this.port);
        })
    }

}

module.exports = Server;