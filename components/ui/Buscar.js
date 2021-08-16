import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';


const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSubmit = styled.input`
    height: 3rem;
    width: 3 rem;
    display: block;
    background-size: 4 rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    text-indent: --9999px;


    &:hover {
        cursor: pointer;
    }

`;



const Buscar = () => {
    return ( 
        <form
            /* css={css`
                position: relative;          
            `}    */     
        >
            <InputText 
                type="text"
                placeholder='Buscar Productos'
            
            ></InputText>

            <InputSubmit type="submit"></InputSubmit>

            

            
            
            
            
            
            
        </form>



     );
}
 
export default Buscar;