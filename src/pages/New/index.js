import './new.scss';
import firebase from '../../services/firebaseConnection';

import { FiPlusCircle } from 'react-icons/fi';
import { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext} from '../../contexts/user';


export default function New(){
    const [assunto, setAssunto] = useState('Equipamentos');
    const [texto, setTexto] = useState('');
    const [tituloTexto, setTituloTexto] = useState('')
    const { user } = useContext(AuthContext);

    const [lista, setLista] = useState({});
    const [idDetected, setIdDetected] = useState(false);

    const { id } = useParams();
    const history = useHistory();

    // Vai pegar a Lista para verificar se o usuario esta tentando
    // editar, ou cadastrar um texto.
    useEffect(() => {

        async function loadTextos(){
            await firebase.firestore().collection('equipamentos')
            .get()
            .then((snapshot) => {
                let data = []

                snapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        assunto: assunto,
                        texto: texto,
                        tituloTexto: tituloTexto
                    })
                })

                setLista(data);
            })
        }

        loadTextos();

        if(id){
            loadId(lista);
        }

    }, [])


    async function loadId(){
        await firebase.firestore().collection('equipamentos').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setTexto(snapshot.data().texto);
            setTituloTexto(snapshot.data().tituloTexto)

            setIdDetected(true);
        })
    }


    // Vai registrar o TxT 
    async function handleRegister(e){
        e.preventDefault();

        // Verificação para ver se o usuario esta tentando editar um texto
        if(idDetected){
            await firebase.firestore().collection('equipamentos')
            .doc(id)
            .update({
                tituloTexto: tituloTexto,
                assunto: assunto,
                texto: texto,
                userName: user.nome
            })
            .then(() => {
                toast.success('Texto editado com Sucesso!')
                setAssunto('Equipamentos');
                setTexto('');
                setTituloTexto('');
                history.push('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Ops! Não foi possivel editar no momento!');
            })

            return;
        } else {
            // Verificação para qual banco vai ser cadastrado o texto
            if(assunto === 'Financeiro' ){
                collectionFinanceiro();
            }else{
                if(assunto === 'Equipamentos'){
                    collectionEquipamentos();
                }else{
                    if(assunto === 'Visitas'){
                        collectionVisitas();
                    }else{
                        if(assunto === 'TextosGerais'){
                            collectionHome()
                        }
                    }
                }
            }    
        }
    };

    // Função para cadastrar no banco da classificação Equipamentos
    async function collectionEquipamentos(){
        await firebase.firestore().collection('equipamentos')
        .add({
            created: new Date(),
            tituloTexto: tituloTexto,
            assunto: assunto,
            texto: texto,
            userName: user.nome
        })
        .then(() => {
            toast.success('Mensagem criada com Sucesso!')
            setAssunto('');
            setTexto('');
            setTituloTexto('');
            setAssunto('Equipamentos');
        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops! Deu algum erro no cadastro!');
        })
    }

    // Função para cadastrar no banco da classificação Financeiro
    async function collectionFinanceiro(){
        await firebase.firestore().collection('financeiro')
        .add({
            created: new Date(),
            tituloTexto: tituloTexto,
            assunto: assunto,
            texto: texto,
            userName: user.nome
        })
        .then(() => {
            toast.success('Mensagem criada com Sucesso!')
            setAssunto('');
            setTexto('');
            setTituloTexto('');
            setAssunto('Equipamentos');

        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops! Deu algum erro no cadastro!');
        })
    }

    // Função para cadastrar no banco da classificação Visitas
    async function collectionVisitas(){
        await firebase.firestore().collection('visitas')
        .add({
            created: new Date(),
            tituloTexto: tituloTexto,
            assunto: assunto,
            texto: texto,
            userName: user.nome
        })
        .then(() => {
            toast.success('Mensagem criada com Sucesso!')
            setAssunto('');
            setTexto('');
            setTituloTexto('');
            setAssunto('Equipamentos');

        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops! Deu algum erro no cadastro!');
        })
    }

    // Função para cadastrar no banco da classificação Home
    async function collectionHome(){
        await firebase.firestore().collection('textosGerais')
        .add({
            created: new Date(),
            tituloTexto: tituloTexto,
            assunto: assunto,
            texto: texto,
            userName: user.nome
        })
        .then(() => {
            toast.success('Mensagem criada com Sucesso!')
            setAssunto('');
            setTexto('');
            setTituloTexto('');
            setAssunto('Equipamentos');

        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops! Deu algum erro no cadastro!');
        })
    }


    // Cuida da seleção do Assunto
    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title nome="Novo Texto">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container2">
                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Titulo do Texto</label>
                        <input type="text"
                               placeholder="Informe o titulo"
                               required
                               value={tituloTexto} 
                               onChange={(e) => setTituloTexto(e.target.value)} />
                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect} >
                            <option value="Equipamentos">Equipamentos</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Visitas">Visitas</option>
                            <option value="TextosGerais">Home/Textos Gerais</option>
                        </select>

                        <label>Texto</label>
                        <textarea type="text" 
                                  placeholder="Descreva o texto a ser enviado"
                                  value={texto}
                                  onChange={(e) => setTexto(e.target.value)}
                                  required />

                        <button type="submit">Registrar</button>
                    </form>
                </div>

            </div>
        </div>
    );
}