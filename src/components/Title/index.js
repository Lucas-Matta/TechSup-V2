import './title.scss';

export default function Title({ children, nome }){
    return(
        <div className="title">
            { children }
            <span>{nome}</span>
        </div>
    );
}