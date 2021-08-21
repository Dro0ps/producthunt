export default function validarCrearProducto(valores) {
    let errores = {};

    // Validar el nombre del usuario 
    if(!valores.nombre){
        errores.nombre ="El nombre es obligatorio";
    }

    // Validar Empresa
    if(!valores.empresa){
        errores.empresa ="El empresa es obligatorio";
    }

   // Validar la Url
   if(!valores.url){
       errores.url = 'La URL del producto es obligatoria';
   } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
       errores.url = "Url no valida"
   }

   // Validar Descripción
   if(!valores.descripcion){
       errores.descripcion = "Agrega una descripcion de tu producto"
   }

    return errores;


}