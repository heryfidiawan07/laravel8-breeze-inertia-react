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
    const { data, setData, reset } = useForm({
        name: props.method == 'PUT' ? props.user.name : '',
        email: props.method == 'PUT' ? props.user.email : '',
        password: '',
        password_confirmation: '',
        roles: props.method == 'PUT' ? props.userRoles : [],
    });

    const handleChange = (e) => {
        if(e.target.type === 'checkbox') {
            let newRoles = [...data.roles, e.target.value]
            if (data.roles.includes(e.target.value)) {
                newRoles = newRoles.filter(val => val !== e.target.value)
            }
            setData(e.target.name, newRoles)
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
            if(key == 'roles') {
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
            Inertia.get(route('user.index'))
        }
    }, [redirect])

    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    // console.log(data)

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Form</h2>}
        >
            <Head title="User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <form onSubmit={submit} action={props.action} data-method={props.method}>
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-3">
                                    <Label forInput="name" value="Name" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        handleChange={handleChange}
                                        required={true}
                                    />
                                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name[0]}</p>}
                                </div>
                                <div className="col-span-3">
                                    <Label forInput="email" value="Email" />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        handleChange={handleChange}
                                        required={true}
                                    />
                                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email[0]}</p>}
                                </div>
                                <div className="col-span-3">
                                    <Label forInput="password" value="Password" />
                                    <Input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        handleChange={handleChange}
                                        required={props.method == 'POST'}
                                    />
                                    {formErrors.password && <p className="text-sm text-red-500">{formErrors.password[0]}</p>}
                                </div>
                                <div className="col-span-3">
                                    <Label forInput="password_confirmation" value="Confirm Password" />
                                    <Input
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        handleChange={handleChange}
                                        required={props.method == 'POST'}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <Label forInput="roles" value="Roles" />
                                    {formErrors.roles && <p className="text-sm text-red-500">{formErrors.roles[0]}</p>}
                                    <div className="my-3"></div>
                                    {props.roles.map(role => {
                                        return(
                                            <div className="mt-3" key={role.id}>
                                                <label className="flex items-center">
                                                    <Checkbox 
                                                        name="roles" 
                                                        value={role.name} 
                                                        handleChange={handleChange} 
                                                        checked={data.roles.includes(role.name)} 
                                                    />
                                                    <span className="text-md font-semibold ml-2">{role.name}</span>
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="sm:flex sm:flex-row-reverse mt-3">
                                <Button className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Save
                                </Button>
                                <Link href={route('user.index')} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
