import './header.scss';
import avatar from '../../assets/avatar.png';

import { AuthContext } from '../../contexts/user';

import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { FiHome, FiSettings, FiMessageSquare } from 'react-icons/fi';
import { GiWifiRouter } from "react-icons/gi";
import { FaCommentDollar } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";

export default function Header(){
    const { user } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto avatar"/>
            </div>

            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
                Home
            </Link>
            <Link to="/new">
                <FiMessageSquare color="#FFF" size={24} />
                Cadastrar txt
            </Link>
            <Link to="/equipamentos">
                <GiWifiRouter color="#FFF" size={24} />
                Equipamentos txt
            </Link>
            <Link to="/financeiro">
                <FaCommentDollar color="#FFF" size={24} />
                Financeiro txt
            </Link>
            <Link to="/visitas">
                <AiFillCar color="#FFF" size={24} />
                Visitas txt
            </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
                Configurações
            </Link>

        </div>
    );
};