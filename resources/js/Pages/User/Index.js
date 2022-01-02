import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { SwallRequest } from '@/Functions/SwallRequest';
import { Link, Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import DataTable from '@/Components/DataTable';

const tableHeader = [
    {'name': null, 'as': '#', 'order': false},
    {'name': 'name', 'as': 'Name', 'order': true},
    {'name': 'email', 'as': 'Email', 'order': true},
    {'name': 'roles', 'as': 'Roles', 'order': false},
    {'name': 'joined', 'as': 'Joined', 'order': true},
    {'name': null, 'as': 'Action', 'order': false}
]

export default function Index(props) {

    const destroy = async (id, reload, params) => {
        let data = new FormData()
        data.append('_method', 'DELETE')
        await SwallRequest(route('user.destroy', id), data, {'reload':reload, 'params':params})
    }

    const btnAction = (row, reload, params) => {
        return(
            <React.Fragment>
                <button 
                    type="button"
                    className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 mx-1 text-white"
                    onClick={() => Inertia.get(route('user.edit', row.id))}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button 
                    type="button"
                    className="rounded bg-red-500 hover:bg-red-700 py-2 px-4 mx-1 text-white"
                    onClick={() => destroy(row.id, reload, params)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </React.Fragment>
        )
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User</h2>}
        >
            <Head title="User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="p-6 bg-white border-b border-gray-200 mb-5">
                            User Data
                            <Link href={route('user.create')} className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded float-right">
                                Create User
                            </Link>
                        </div>

                        <DataTable
                            data={props.users}
                            url={route('user.index')}
                            tableHeader={tableHeader}
                            btnAction={btnAction}
                        />

                    </div>
                </div>
            </div>
        </Authenticated>
    )
}

