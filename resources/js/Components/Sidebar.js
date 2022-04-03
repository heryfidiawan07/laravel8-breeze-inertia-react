import React, { useState } from 'react';
// import Authenticated from '@/Layouts/Authenticated';
// import { Head } from '@inertiajs/inertia-react';
import { Link } from '@inertiajs/inertia-react';

export default function Sidebar({ auth }) {
	// console.log('Sidebar auth',auth)

	const path = window.location.pathname.split('/')

    return (
        <aside id="sidebar-wrapper">
        	<div className="sidebar-brand">
            	<Link href={route('dashboard')}>Stisla</Link>
          	</div>
          	<div className="sidebar-brand sidebar-brand-sm">
            	<Link href={route('dashboard')}>St</Link>
          	</div>
          	<ul className="sidebar-menu">
			  	<li className="menu-header">Dashboard</li>
			  	<li className="">
				  	<Link className="nav-link nav-menu" href={route('dashboard')}>
						<i className="fas fa-fire"></i><span className="sidebar-parent">Dashboard</span>
					</Link>
				</li>
				{auth.user.can.length > 0 && (
					<React.Fragment>
						<li className="menu-header">Core</li>
						<li className={`dropdown ${path[1] == 'user' || path[1] == 'role' ? 'active' : ''}`}>
							<a href="#administrator" className="nav-link has-dropdown" data-toggle="collapse">
								<i className="fas fa-columns"></i> <span className="sidebar-parent">Administrator</span>
							</a>
							<ul className={`drop-menu ${path[1] == 'user' || path[1] == 'role' ? '' : 'collapse'}`} id="administrator">
								{auth.user.can.includes('user-menu') &&
									<li className={path[1] == 'user' ? 'active' : ''}>
										<Link href={route('user.index')} className="nav-link nav-menu">
											User
										</Link>
									</li>
								}
								{auth.user.can.includes('role-menu') &&
									<li className={path[1] == 'role' ? 'active' : ''}>
										<Link href={route('role.index')} className="nav-link nav-menu">
											Role
										</Link>
									</li>
								}
							</ul>
						</li>
					</React.Fragment>
				)}
        	</ul>
          	<div className="mt-5 mb-4 p-3 hide-sidebar-mini">
            	<a href="https://getstisla.com/docs" className="btn btn-primary btn-lg btn-block btn-icon-split">
              		<i className="fas fa-rocket"></i> Documentation
            	</a>
          	</div>        
        </aside>
    );
}
