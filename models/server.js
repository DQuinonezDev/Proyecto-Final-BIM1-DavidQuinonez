//Importaciones de necesario para nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/dbconection');



class Server {

    constructor() {

        //Configuración inicial
        this.app = express();
        this.port = process.env.PORT;


        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios'
        }



        // Middlewares
        this.middlewares();


        //Rutas de mi app
        this.routes();


        //Conectar a base de datos
        this.conectarDb();
    }

    async conectarDb() {
        await dbConection();
    }

    //Un middleware es una función que se ejecuta antes de las rutas
    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico (HTML)
        this.app.use(express.static('public'));

    }


//* RUTAS
    routes() {
        this.app.use(this.paths.categorias, require('../routes/categoria'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.buscar , require('../routes/buscar'));
        this.app.use(this.paths.productos, require('../routes/producto'));

    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('El servidor esta corriendo en el puerto ', this.port);
        })
    }


}


//Importamos la clase Server
module.exports = Server;