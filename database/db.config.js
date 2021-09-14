const mongoose = require('mongoose');


const dbConection = async()=> {

    try {
        mongoose.connect(process.env.MONGODB_CNN)
        console.log('Base de datos Online')
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la base de datos');
    }

}

module.exports = {
    dbConection,
}