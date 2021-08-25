import { FaCommentDollar } from "react-icons/fa";

import Header from '../../components/Header';
import Title from '../../components/Title';

import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import { useState, useEffect } from 'react';
import { FiPlus, FiCopy, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const listRef = firebase.firestore().collection('financeiro').orderBy('created','desc');

export default function Financeiro(){
    const [textos, setTextos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const [copieted, setCopieted] = useState({value: '', copied: false});

    // Quando a aplicação carregar, faça isso;
    useEffect(() => {
        
        async function loadTextos(){
            await listRef.limit(50)
            .get()
            .then((snapshot) => {
                updateState(snapshot)
    
            })
            .catch((error) => {
                console.log('Erro ao Buscar Informações' + error)
                setLoadingMore(false);
            })
    
            setLoading(false);
        }

        loadTextos();

        return() => {

        }
    }, [])


    // Função responsavel por montar a lista
    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;
            
        // Se não estiver vazio  a Collection;
        if(!isCollectionEmpty){
            let lista = [];
            
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    texto: doc.data().texto,
                    tituloTexto: doc.data().tituloTexto,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    userName: doc.data().userName,
                })
            })
            // Busca os textos que ja estão aparecendo, e os novos adicionados
            setTextos(textos => [...textos, ...lista]);

        } else {
            setIsEmpty(true);
            toast.info('Nenhum chamado encontrado!')
        }

        setLoadingMore(false);
    }

    // Caso o Loading for True
    if(loading){
        return(
            <div>
                <Header/>
            
                <div className="content">
                    <Title nome="Textos sobre questões Financeiras">
                        <FaCommentDollar size={25} />
                    </Title>
                </div>

                <div className="container dashboard">
                    <span>Buscando Textos...</span>
                </div>
            </div>
        );
    }

    function clickCopied(){
        toast.dark('Texto Copiado!')
    }

return(
    <div>
        <Header/>
           <div className="content">
              <Title nome="Textos sobre questões Financeiras">
                <FaCommentDollar size={25} />
              </Title>

                
            {textos.length === 0 ? (
                <div className="container2 dashboard">
                    <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className="new">
                            <FiPlus color="#FFF" size={23} />
                             Novo Texto
                        </Link>
                </div>  
            ) : (
                <>
                    <Link to="/new" className="new2">
                        <FiPlus color="#FFF" size={23} />
                            Novo Texto
                    </Link>

                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Assunto</th>
                                <th scope="col">Texto</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {textos.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td data-label="Assunto">{item.tituloTexto}</td>
                                        <td style={{textAlign: 'left'}} data-label="Texto">{item.texto}</td>
                                        <td data-label="">

                                            <CopyToClipboard text={item.texto} onCopy={() => setCopieted({copied: true})}>
                                                <button className="action" 
                                                        style={{backgroundColor: '#3583f6'}}
                                                        id="copy"
                                                        onClick={clickCopied}
                                                        value={copieted} >
                                                    <FiCopy size={17} color="FFF" />
                                                </button>
                                            </CopyToClipboard>

                                            <Link className="action" to={`/editfinanceiro/${item.id}`}
                                                style={{backgroundColor: '#F6a935'}} >
                                                <FiEdit2 size={17} color="FFF" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    </div>
    );
}