import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { SwallRequest } from '@/Functions/SwallRequest';
import { Link, Head } from '@inertiajs/inertia-react';
import DataTable from '@/Components/DataTable';
import SectionHeader from '@/Components/SectionHeader';

export default function Index(props) {

    const destroy = async (id, reload, params) => {
        let data = new FormData()
        data.append('_method', 'DELETE')
        await SwallRequest(route('user.destroy', id), data, {'reload':reload, 'params':params})
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="User Management" />

            <section className="section">
                <SectionHeader title="User Management" />
                <div className="section-body">
                    <h2 className="section-title">
                        Title
                        <Link href={route('user.create')} className="btn btn-primary float-right">
                            Create User
                        </Link>
                    </h2>
                    <p className="section-lead">Example of some Bootstrap table components.</p>
                    
                    <DataTable
                        data={props.users}
                        url={route('user.index')}
                        header={[
                            {'name': null, 'as': '#', 'order': false},
                            {'name': 'name', 'as': 'Name', 'order': true},
                            {'name': 'email', 'as': 'Email', 'order': true},
                            {'name': 'roles', 'as': 'Roles', 'order': false},
                            {'name': 'joined', 'as': 'Joined', 'order': true},
                            {'name': null, 'as': 'Action', 'order': false}
                        ]}
                        button={(row, reload, params) => {
                            return(
                                <div className="d-flex">
                                    <Link href={route('user.edit', row.id)} className="btn btn-primary btn-sm mr-1">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button 
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => destroy(row.id, reload, params)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            )
                        }}
                    />
                </div>
            </section>
        </Authenticated>
    )
}
