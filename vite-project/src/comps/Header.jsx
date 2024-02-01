import React, { useEffect ,useContext} from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AppContext } from '../context/context';

const Header = () => {

    const { user, setUser } = useContext(AppContext);
    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    return (
        <header className="bg-white border">
            <nav className="container mx-auto flex items-center justify-between p-4">

                <ul className="flex space-x-4">
                    <li>
                        <Link to="/home" className="text-blue-700 hover:text-purple-500 transition duration-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="text-blue-700 hover:text-purple-500 transition duration-300">
                            Login
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/add-table" className="text-blue-700 hover:text-purple-500 transition duration-300">
                            Add Table
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link to="/make-order" className="text-blue-700 hover:text-purple-500 transition duration-300">
                            Make Order
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/add-restaurant" className="text-blue-700 hover:text-purple-500 transition duration-300">
                            Add Restaurant
                        </Link>
                    </li>
                    <li>
                        <Link to="/restaurant-management" className="text-blue-700 hover:text-purple-500 transition duration-300">
                        management
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;