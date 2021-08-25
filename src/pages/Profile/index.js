import firebase from '../../services/firebaseConnection';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/user';
import { toast } from 'react-toastify'
import './profile.scss';
import { FiSettings, FiUpload } from 'react-icons/fi';

import Header from '../../components/Header';
import Title from '../../components/Title';

import avatar from '../../assets/avatar.png'

export default function Profile(){
    const { user, setUser, signOut, storageUser } = useContext(AuthContext);

    // Vai pegar as informações do contexto, e preencher
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [loadingSave, setLoadingSave] = useState(false);

    // Função para mostrar o preview da imagem
    function handleFile(event){
        // Vai pegar a imagem que aparece no console.log
        // E vai verificar se o usuario fez upload da imagem
        if(event.target.files[0]){
            const image = event.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png' ){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(event.target.files[0]))
            } else {
                alert('Envie uma Imagem do Tipo PNG/JPEG!');
                setImageAvatar(null);
                return null;
            }
        }
    };

    // Função para subir a imagem
    async function handleUpload(){
        setLoadingSave(true);
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)

        // Em caso de Sucesso
        .then( async () => {

            await firebase.storage()
            .ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()

            // Em caso de Sucesso
            .then( async (url) => {
                let urlFoto = url;

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    nome: nome
                })
                
                // Em caso de Sucesso
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        nome: nome
                    };

                    setUser(data);
                    storageUser(data);
                    setLoadingSave(false);
                    toast.success('Informações Alteradas!');
                })
            })
        })
    };

    async function handleSave(e){
        setLoadingSave(true);
        e.preventDefault();
        
        // Verificação para caso o usuario so queira mudar somente o Nome
        if(imageAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
                setLoadingSave(false);
                toast.success('Nome Alterado!')
            })
            .catch((error) => {
                alert('Deu Algum Erro!' + error)
            })
        }
        // Se não se...
        else if(nome !== '' && imageAvatar !== null){
            handleUpload();
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        <div>
            <Header />

            <div className="content">
                <Title nome="Meu perfil">
                    <FiSettings size={25} /> 
                </Title>
            </div>

            <div className="container">
                <form className="form-profile" onSubmit={handleSave}>

                    <label className="label-avatar">
                        <span><FiUpload color="#FFF" size={25} /></span>
                            
                        <input type="file" accept="image/*" onChange={handleFile} /><br/>
                        
                        { avatarUrl === null ?
                           <img src={ avatar } width='250' height='250' alt='Foto de Perfil'/>
                           :
                           <img src={ avatarUrl } width='250' height='250' alt='Foto de Perfil'/>
                        }
                    </label>

                    <label className="titulo">Nome </label>
                    <input type="text" value={nome} onChange={ (event) => setNome(event.target.value)} />

                    <label className="titulo">Email </label>
                    <input type="text" value={email} disabled={true} />

                    <button type="submit" >{loadingSave ? 'Salvando...' : 'Salvar'}</button>

                </form>
            </div>

            <div className="container">
                <button className="sair" onClick={signOut}>Sair</button>
            </div>
        </div>
    );
}