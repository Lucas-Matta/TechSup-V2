import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import New from '../pages/New';

import Equipamentos from '../pages/Equipamentos';
import Financeiro from '../pages/Financeiro';
import Visitas from '../pages/Visitas';

import EditFinanceiro from '../pages/EditFinanceiro';
import EditVisitas from '../pages/EditVisitas';
import EditHome from '../pages/EditHome';

export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/profile" component={Profile} isPrivate />
            <Route exact path="/equipamentos" component={Equipamentos} isPrivate />
            <Route exact path="/financeiro" component={Financeiro} isPrivate />
            <Route exact path="/visitas" component={Visitas} isPrivate />
            <Route exact path="/new" component={New} isPrivate />
            <Route exact path="/new/:id" component={New} isPrivate />
            <Route exact path="/editfinanceiro" component={EditFinanceiro} isPrivate />
            <Route exact path="/editfinanceiro/:id" component={EditFinanceiro} isPrivate />
            <Route exact path="/editvisitas" component={EditVisitas} isPrivate />
            <Route exact path="/editvisitas/:id" component={EditVisitas} isPrivate />
            <Route exact path="/edithome" component={EditHome} isPrivate />
            <Route exact path="/edithome/:id" component={EditHome} isPrivate />
        </Switch>
    )
}