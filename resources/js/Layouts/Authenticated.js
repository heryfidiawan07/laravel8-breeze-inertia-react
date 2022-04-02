import React from 'react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';

export default function Authenticated({ auth, header, children }) {
    // const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // console.log('Authenticated auth',auth)

    return (
        <div id="app">
            <div className="main-wrapper">
                <div className="navbar-bg"></div>
                <Navbar auth={auth} />
                <div className="main-sidebar sidebar-style-2">
                    <Sidebar auth={auth} />
                </div>
                <div className="main-content" style={{ minHeight: '509px' }}>
                    {children}
                </div>
                <footer className="main-footer">
                    <div className="footer-left">
                        Copyright &copy; 2018 <div className="bullet"></div> 
                        Design By <a href="https://nauval.in/">Muhamad Nauval Azhar</a>
                    </div>
                    <div className="footer-right">
                    </div>
                </footer>
            </div>
        </div>
    );
}
