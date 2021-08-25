import { useState, useEffect, createContext } from 'react';
import firebase from '../services/firebaseConnection';

import { toast } from 'react-toastify'

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    // Quando o site carregar, Faça essa verificação;
    useEffect(() => {
        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
            // Caso o usuario estiver logado
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        };
        
        loadStorage();

    }, [])

    // Função de Login do usuario
    async function signIn(email, password){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo de volta!');

        })
        .catch((error) => {
            console.log(error);
            toast.error('Email ou senha invalido!');
            setLoadingAuth(false);
        })
    }


    // Função de Cadastro do Usuario
    async function signUp(email, password, nome){
        setLoadingAuth(true)

        // Cadastro Usuario
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            // Cadastro No Banco
            await firebase.firestore().collection('users')
            .doc(uid)
            .set({
                nome: nome,
                avatarUrl: null,
            })
            // Objeto com as info do Usuario
            .then(() => {
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null,
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem vindo a plataforma!');
            })
            // Em Caso de Erro
            .catch((error) => {
                console.log(error);
                toast.error('Ops! algo deu errado!');
                setLoadingAuth(false);
            })
        })
        // Em Caso de Erro
        .catch((error) => {
            console.log(error + alert('[ERRO] Ops! deu algum problema'));
            setLoadingAuth(false);
        })
    };

    // Para Salvar o Usuario localmente
    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data))
    }

    // Deslogar
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    return(
        // !!user para converter os objetos em boolean
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            setUser,
            storageUser,
            loading,
            loadingAuth,
            signUp,
            signOut,
            signIn
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;