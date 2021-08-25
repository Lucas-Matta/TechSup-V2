import './signin.scss';

import { AiTwotoneLock, AiTwotoneMail } from 'react-icons/ai';
import { FaKey } from 'react-icons/fa';

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/user';

function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth }  = useContext(AuthContext);

    function handleSubmit(event){
        // Pra não atualizar a pagina
        event.preventDefault();

        if(email !== '' && password !== ''){
            signIn(email, password)
        };
        
    }

    return(
        <section className="banner-principal">
            <div className="slayer"></div>
            <div className="containerFormulario">
                <form onSubmit={handleSubmit}>
                    <h2 style={{marginBottom: '20px'}}><AiTwotoneLock size={50} className="cadeado" />Login</h2>

                    <div className="input-wraper">
                        <span><AiTwotoneMail/></span>
                        <input type="text"
                               placeholder="Email"  
                               required
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               />
                    </div>

                    <div className="input-wraper">
                        <span><FaKey/></span>
                        <input type="password"
                               placeholder="Password" 
                               required
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               />
                    </div>

                    <Link to="/register">Não tem conta? <strong>Cadastre-se</strong></Link>

                    <div className="input-wraper">
                        <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                    </div>
                </form>
            </div>

        </section>
    );
};

export default SignIn;