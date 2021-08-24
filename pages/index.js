import React, { useEffect, useState, useContext } from 'react';
import DetallesProducto from '../components/layout/DetallesProducto';
import Layout from '../components/layout/layout';
import { FirebaseContext } from '../firebase';
import NuevoProducto from './nuevo-producto';





const Home = () => {
  
  const [productos, guardarProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () =>{
      firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarSnapshot)
    }
    obtenerProductos();
  }, []);

  function manejarSnapshot(snapshop){
    const productos = snapshop.docs.map(doc => {
      return {
        id: doc.id,
      ...doc.data()
      }
      
    });

    guardarProductos(productos);
  
    
  }

  
  
  
  
  
  
  
  return(
    <div>

      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
            
            {/* Se pasan los valores de cada producto al componente DetallesProducto a traves del key y el props producto = {producto} */}
              {productos.map(producto => (
                <DetallesProducto
                  key = {producto.id}
                  producto = {producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>


    </div>
  )
}
  

  export default Home;
