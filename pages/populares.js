import React from 'react';
import DetallesProducto from '../components/layout/DetallesProducto';
import Layout from '../components/layout/layout';
import useProductos from '../hooks/useProductos';

const Populares = () => {

  const  { productos } = useProductos('votos');
  
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
  
  export default Populares;
