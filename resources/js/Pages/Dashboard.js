import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import SectionHeader from '@/Components/SectionHeader';
import { Head } from '@inertiajs/inertia-react';

export default function Dashboard(props) {
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <section className="section">
                <SectionHeader title="Dashboard" />
                <div className="section-body">
                    <h2 className="section-title">Dashboard</h2>
                    <p className="section-lead">Example of some Bootstrap table components.</p>
                    <h1>Dashboard Content</h1>
                </div>
            </section>
        </Authenticated>
    );
}
