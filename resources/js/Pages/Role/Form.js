import React, { useState, useEffect } from 'react';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';
import Authenticated from '@/Layouts/Authenticated';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { SwallRequest } from '@/Functions/SwallRequest';

export default function Form(props) {
    const { data, setData } = useForm({
        name: props.method == 'PUT' ? props.role.name : '',
        permissions: props.method == 'PUT' ? props.rolePermissions : [],
    });

    const handleChange = (e) => {
        if(e.target.type === 'checkbox') {
            let newPermissions = [...data.permissions, e.target.value]
            if (data.permissions.includes(e.target.value)) {
                newPermissions = newPermissions.filter(val => val !== e.target.value)
            }
            setData(e.target.name, newPermissions)
        }else {
            setData(e.target.name, e.target.value)
        }
    }

    const [formErrors, setFormErrors] = useState([])
    const submit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('_method', e.target.getAttribute('data-method'))
        for (const [key, value] of Object.entries(data)) {
            if(key == 'permissions') {
                formData.append(`${key}`, JSON.stringify(value))
            }else {
                formData.append(`${key}`, value)
            }
        }
        console.log('formData',formData)
        SwallRequest(e.target.action, formData, {'errors':setFormErrors, 'redirect':setRedirect})
    }

    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        if(redirect === true) {
            Inertia.get(route('role.index'))
        }
    }, [redirect])

    // console.log(data)

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Form</h2>}
        >
            <Head title="Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <form onSubmit={submit} action={props.action} data-method={props.method}>
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-6">
                                    <Label forInput="name" value="Name" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        handleChange={handleChange}
                                    />
                                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name[0]}</p>}
                                </div>
                                <div className="col-span-6">
                                    <Label forInput="permissions" value="Permissions" />
                                    {formErrors.permissions && <p className="text-sm text-red-500">{formErrors.permissions[0]}</p>}
                                    <div className="my-3"></div>
                                    {props.permissions.map(permission => {
                                        return(
                                            <div className="mt-3" key={permission.id}>
                                                <label className="flex items-center">
                                                    <span className="text-lg font-semibold">{permission.name}</span>
                                                </label>
                                                <div className="flex">
                                                    {permission.children.map(child => {
                                                        return (
                                                            <div key={child.id} className="form-check form-check-inline mr-2">
                                                                <label className="inline-block">
                                                                    <Checkbox 
                                                                        name="permissions" 
                                                                        value={child.name} 
                                                                        handleChange={handleChange} 
                                                                        checked={data.permissions.includes(child.name)} 
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-600">{child.name}</span>
                                                                </label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="sm:flex sm:flex-row-reverse mt-3">
                                <Button className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Save
                                </Button>
                                <Link href={route('role.index')} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
