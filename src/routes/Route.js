import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/user';

// Recebe o Component que vai renderizar
// isPrivate, para ver se rota e privada
// ...rest, vai pegar o resto das config
export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}){

    const { signed, loading } = useContext(AuthContext);

    // Caso o Loading for true; (Caso o usuario estiver logando)
    if(loading){
        return(
            <div></div>
        )
    };
    // Caso o usuario não esteja logado, e tentar acessar uma rota privada, vai mandar pra home;
    if(!signed && isPrivate){
        return <Redirect to="/" />
    };

    // Caso o usuario esteja logado, e tentar acessar uma rota que não e privada, vai mandar para
    // o dashboard
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    }

    return(
        <Route 
            {...rest}
            render={ props => (
                <Component {...props} />
            )}  />
    );
}