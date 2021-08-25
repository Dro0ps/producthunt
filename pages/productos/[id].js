import { css } from '@emotion/react';
import styled from '@emotion/styled/';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/layout';
import { FirebaseContext } from '../../firebase';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';




const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }

`;

const CreadorProducto = styled.p `
    padding: .5rem 1rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;



const Producto = (props) => {
    // State del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);


    // Routing para obtener el id actual
    const router = useRouter();

    // Destructurando el id que viene dentro de query en router
    const { query: { id } } = router;

    // Context de Firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    // UsesEffect para evitar el undefined y errores
    useEffect(() => {
        if(id, consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                /* guardarProducto(producto.data()); */
                //Funcion exists es de firebase para verificar si un producto existe
                if(producto.exists) {
                    guardarProducto(producto.data());
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
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
    const {  comentarios, creado, descripcion, empresa, nombre, url, imagenUrl, votos, creador, haVotado } = producto;


    // Administrar y validar los votos
    const votarProducto = () => {
        if(!usuario) {
            return router.push('/login')
        }

        // Obtener y swumar un nuevvo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario ha Votado
        if(haVotado.includes(usuario.uid)) return;

        // Guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // Actualizar en la base de datos
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // actualizar el State
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })
        guardarConsultarDB(true); // Hay un voto por tanto consultar la base de datos

    }

    // Funciones para crear Comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    // Identifica si el comentario es el del creador del producto
    const esCreador = id => {
        if(creador.id == id){
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();

        if(!usuario) {
            return router.push('/login')
        }

        // Informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlo al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        // Actualizar la Base de Datos
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })


        // Actualizar el State
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true); // Hay un comentario por lo tanto consultar la base de datos



    }

    return ( 
        <>
            <Layout>
                {/* { error && <Error404/> } */}
                
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;                    
                    `}>{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow( new Date(creado), {locale: es} )} </p>
                            <p>por <span css={css`font-weight: bold;`}>{creador.nombre}</span> de {empresa}</p>

                            <img src={imagenUrl}/>
                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                <h2>Agrega tu comentario</h2>
                                <form
                                    onSubmit={agregarComentario}
                                >
                                    <Campo>
                                        <input
                                            type="text"
                                            name="mensaje"
                                            onChange={comentarioChange}
                                        />
                                    </Campo>
                                    <InputSubmit
                                        type="submit"
                                        value="Agregar Comentario"
                                    />
                                        
                                </form>
                                </>
                            )}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>

                            {comentarios.length === 0 ? "Aún no hay comentarios" :

                                (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                            font-weight: bold;

                                                        `}
                                                    >
                                                        {' '}{comentario.usuarioNombre}
                                                    </span> 
                                                </p>
                                                { esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>

                                )                            
                            
                            }

                        </div>

                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar URL</Boton>

                            

                            <div css={css`
                                margin-top: 5rem;
                            `}>
                                <p css={css`
                                    text-align: center;
                                `}                     
                                >{votos} Votos</p>

                            { usuario && 
                            ( 

                            <Boton
                                onClick={votarProducto}
                            
                            >Votar</Boton>
                            
                            
                            ) }

                                
                            </div>
                            
                        </aside>
                    </ContenedorProducto>





                </div>
            </Layout>

        </>
        
     );
}
 
export default Producto;