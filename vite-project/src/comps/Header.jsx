import React, { useContext, useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AppContext } from '../context/context';

const Header = () => {
    const { user, setUser } = useContext(AppContext);
    const [isHovered, setIsHovered] = useState(false);

    const isAuthenticated = user && user.username; // Adjust this based on your actual user structure.

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    const headerStyle = {
        backgroundColor: isHovered ? '#ffbf00' : '#cc9900',
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <header style={headerStyle} className="border">
            <nav className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img
                        src="https://t4.ftcdn.net/jpg/00/80/99/35/240_F_80993562_peLt3a9U8brcY21wUJfajqaMvOuLgjKL.jpg"
                        alt="Logo"
                        className="w-8 h-8 mr-2"
                    />
                    <h1 className="text-3xl font-bold text-white">
                        <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
                            Restaurant
                        </Link>
                    </h1>
                </div>

                <ul className="flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/restaurant-management" className="text-white transition duration-300">
                                    Management
                                </Link>
                            </li>
                            <li>
                                <Link to="/add-restaurant" className="text-white transition duration-300">
                                    Add Restaurant
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-white transition duration-300">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="text-white transition duration-300">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
