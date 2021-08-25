import { css } from '@emotion/react';
import React, { useState, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout/layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';


// VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import Error404 from '../components/layout/404';


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}


const NuevoProducto = () =>  {

  const [ error, guardarError ] = useState(false);
  const [image, setImage] = useState(null);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = 
  useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto );

  // Hook de routing para redireccionar
  const router = useRouter();

  const { nombre, empresa, imagen, url, descripcion } = valores;

  // Context con las operaciones Crud de Firebase
  const {usuario, firebase}= useContext(FirebaseContext);


  // Manejando las imagenes
  const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      setImage(e.target.files[0])
    }
    
  }

  //sube a imagen y descarga la ruta para guardarla en la base de datos
  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`productos/${image.lastModified}${image.name}`).put(image);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL
  }

  async function crearProducto(){

    // Si el usuario no esta autenticado llevar al login
    if(!usuario) {
      return router.push('/login');
    }

    // Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      imagenUrl: await handleUpload(),
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    // Insertarlo en la base de datos
    console.log(producto);
    await firebase.db.collection('productos').add(producto); 

    return router.push('/');
   
  }



  return(
  
    <div>

      <Layout>
        { !usuario ? <Error404/> : 
        
        (
        <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Nuevo Producto</h1>
        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >
          {/*******************Primer Field Set *****************/}
          <fieldset>
            <legend>Información General</legend>

            <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Nombre del Producto"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              /* onBlur={handleBlur} */
            />
          </Campo>

          {errores.nombre && <Error>{errores.nombre}</Error>}
          

          <Campo>
            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              id="empresa"
              placeholder="Nombre de la empresa"
              name="empresa"
              value={empresa}
              onChange={handleChange}
              /* onBlur={handleBlur} */
            />
          </Campo>

          {errores.empresa && <Error>{errores.empresa}</Error>}

          <Campo>
            <label htmlFor="imagen">Imagen</label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              name="imagen"
              onInput={(e) => handleFile(e)}
            />
          </Campo>

          {errores.imagen && <Error>{errores.imagen}</Error>}

          <Campo>
            <label htmlFor="url">Url</label>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="URL de tu Producto"
              value={url}
              onChange={handleChange}
              /* onBlur={handleBlur} */
            />
          </Campo>

          {errores.url && <Error>{errores.url}</Error>}

          </fieldset>

          {/*******************Segundo Field Set *****************/}

          <fieldset>
            <legend>Sobre tu Producto</legend>
            <Campo>
              <label htmlFor="descripcion">Descripcion</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
                /* onBlur={handleBlur} */
              />
            </Campo>

            {errores.descripcion && <Error>{errores.descripcion}</Error>}

          </fieldset>

          {error && <Error>{error}</Error>}

          <InputSubmit 
          
            type="submit"
            value="Crear Producto"
          
          />
        </Formulario>


        </>
        )
        
        }
        

      </Layout>


    </div>
  )

}
  

  export default NuevoProducto;
