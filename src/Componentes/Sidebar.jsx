import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../Contexts/AuthContext';

function Sidebar () {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    const linkClass = ({ isActive }) =>
        isActive ? styles.link + ' ' + styles.ativo : styles.link;

    return (
        <aside className= 'sidebar'>
            <div className={styles.logo}>
                <h1>TaskFlow</h1>
            </div>
            <nav className={styles.nav}>
              {usuario && <NavLink to='/' className={linkClass}>DashBoard</NavLink>}
                <NavLink to='/sobre' className={linkClass}>Sobre</NavLink>
                <div className='sidebar-usuario'>
                <span>Ola, {usuario?.nome ?? 'Usuario'}</span>
                </div>
            </nav>
            {usuario && (<button onClick={handleLogout}>Sair</button>)}
            
        </aside>
    );
}
export default Sidebar;