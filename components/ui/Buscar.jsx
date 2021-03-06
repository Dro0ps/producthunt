import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Router from 'next/router';
import React, { useState } from 'react';



const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    margin-top: 0.5rem;
    background-size: 3rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    text-indent: -9999px;
   


    &:hover {
        cursor: pointer;
    }

`;



const Buscar = () => {

    const  [ busqueda, guardarBusqueda ] = useState('');

    const buscarProducto = e => {
        e.preventDefault();

        if(busqueda.trim() === '') return;

        // Redireccionar a Buscar y pasar valores a un componente en especifico
        Router.push({
            pathname: '/buscar',
            query: { q : busqueda }
        });

        
    }

    return ( 
        <form
            css={css`
                position: relative;          
            `} 
            onSubmit={buscarProducto}  
              
        >
            <InputText 
                type="text"
                placeholder='Buscar Productos'
                onChange={ e => guardarBusqueda(e.target.value) }
            
            ></InputText>

            <InputSubmit type="submit">Buscar</InputSubmit>


        </form>



     );
}
 
export default Buscar;