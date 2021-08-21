import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAtenticacion from '../hooks/useAutenticacion';

const MyApp = props => {
    const usuario = useAtenticacion();
    console.log(usuario);

    const { Component, pageProps } = props;


    return ( 
    <FirebaseContext.Provider
        value={{
            firebase,
            usuario
        }}
    
    >

        <Component {...pageProps} />

    </FirebaseContext.Provider>
     );
}
 
export default MyApp;