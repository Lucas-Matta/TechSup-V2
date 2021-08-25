import './edit.scss';
import firebase from '../../services/firebaseConnection';

import { FiPlusCircle } from 'react-icons/fi';
import { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext} from '../../contexts/user';


export default function EditHome(){
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
            await firebase.firestore().collection('textosGerais')
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
        await firebase.firestore().collection('textosGerais').doc(id)
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
            await firebase.firestore().collection('textosGerais')
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
            return;
        }
    };

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

                        <button type="submit">Editar</button>
                    </form>
                </div>

            </div>
        </div>
    );
}