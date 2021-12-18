const path = require('path')
const {v4: uuidv4} = require('uuid')

const cargarArchivos = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'webp'], carpeta = '' )=> {

    return new Promise ((resolve, reject) => {

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1]
    
        //Validar extension
    
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, solo estan permitidas las siguientes ${extensionesPermitidas}`)
            
        }
        
        newUniqNameUuid = uuidv4() + '.' + extension;
    
        uploadPath = path.join(__dirname,'../uploads/', carpeta, newUniqNameUuid);
        
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
        
            return resolve(newUniqNameUuid);
        });

    })

}


module.exports = {
    cargarArchivos,
}