import { css } from '@emotion/react';
import styled from '@emotion/styled/';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/layout';
import { FirebaseContext } from '../../firebase';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';


const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }

`;



const Producto = (props) => {
    // State del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);


    // Routing para obtener el id actual
    const router = useRouter();

    // Destructurando el id que viene dentro de query en router
    const { query: { id } } = router;

    // Context de Firebase
    const { firebase } = useContext(FirebaseContext);

    // UsesEffect para evitar el undefined y errores
    useEffect(() => {
        if(id) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                /* guardarProducto(producto.data()); */
                //Funcion exists es de firebase para verificar si un producto existe
                if(producto.exists) {
                    guardarProducto(producto.data());
                } else {
                    guardarError(true);
                }
            }
            obtenerProducto();
        }
       
    }, [id]);


    // Mostrar un Loading mientras se refleja la información del objeto
    if(Object.keys(producto).length === 0) return <div css={css`
        text-align: center;
        margin-top: 5rem;
        font-size: 2rem;
    
    `}>Cargando...</div>

    //Destructurando los campos de producto que se requieren
    const {  comentarios, creado, descripcion, empresa, nombre, url, imagenUrl, votos } = producto;


    return ( 
        <>
            <Layout>
                { error && <Error404/> }
                
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;                    
                    `}>{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow( new Date(creado), {locale: es} )}</p>
                        </div>

                        <aside>
                            2
                        </aside>
                    </ContenedorProducto>





                </div>
            </Layout>

        </>
        
     );
}
 
export default Producto;