import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children }) {
    return (
        <div id="app">
            <section className="section">
                {children}
            </section>
        </div>
    );
}
