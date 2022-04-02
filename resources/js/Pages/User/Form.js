import React, { useState, useEffect } from 'react';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';
import Authenticated from '@/Layouts/Authenticated';
import SectionHeader from '@/Components/SectionHeader';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { SwallRequest } from '@/Functions/SwallRequest';

export default function Form(props) {
    // console.log('user form props', props)

    const { data, setData, processing, errors, reset } = useForm({
        name: props.method == 'PUT' ? props.user.name : '',
        email: props.method == 'PUT' ? props.user.email : '',
        password: '',
        password_confirmation: '',
        roles: props.method == 'PUT' ? props.userRoles : [],
    });

    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        if(redirect === true) {
            Inertia.get(route('user.index'))
        }
    }, [redirect])

    const onHandleChange = (e) => {
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

    const submit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('_method', props.method)
        for (const [key, value] of Object.entries(data)) {
            if(key == 'roles') {
                formData.append(`${key}`, JSON.stringify(value))
            }else {
                formData.append(`${key}`, value)
            }
        }
        console.log('formData',formData)
        SwallRequest(props.action, formData, {'errors':errors, 'redirect':setRedirect})
    }

    console.log(data)

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Form</h2>}
        >
            <Head title="User Form" />

            <section className="section">
                <SectionHeader title="User Management" />
                <div className="section-body">
                    <h2 className="section-title">Title</h2>
                    <p className="section-lead">Example of some Bootstrap table components.</p>

                    <div className="card p-3">
                        <form onSubmit={submit} className="needs-validation">
                            <div className="row">
                                <div className="form-group col-6">
                                    <Label forInput="name" value="Name" className={'control-label'} />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        autoComplete="current-email"
                                        handleChange={onHandleChange}
                                        required={true}
                                        error={errors.name}
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <Label forInput="email" value="Email" className={'control-label'} />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="current-email"
                                        handleChange={onHandleChange}
                                        required={true}
                                        error={errors.email}
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <Label 
                                        forInput="password" 
                                        value="Password" 
                                        className={'control-label'} 
                                    />
                                    <Input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        handleChange={onHandleChange}
                                        required={props.method == 'POST'}
                                        error={errors.password}
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <Label 
                                        forInput="password" 
                                        value="Confirm Password" 
                                        className={'control-label'} 
                                    />
                                    <Input
                                        type="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="current-password_confirmation"
                                        handleChange={onHandleChange}
                                        required={data.password != ""}
                                        error={errors.password_confirmation}
                                    />
                                </div>
                                <div className="form-group col-12">
                                    <Label  
                                        value="Roles" 
                                        className={'control-label'} 
                                    />
                                    
                                    {errors.roles && <div className="text-danger">{errors.roles}</div>}

                                    {props.roles.map((role, index) => {
                                        return(
                                            <div key={index} className="custom-control custom-checkbox">
                                                <Checkbox 
                                                    id={role.id}
                                                    name="roles" 
                                                    value={role.name} 
                                                    checked={data.roles.includes(role.name)}
                                                    handleChange={onHandleChange} 
                                                    label={role.name}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="form-group col-12">
                                    <Button className="btn btn-primary px-4" processing={processing}>
                                        Save
                                    </Button>
                                    <Link href={route('user.index')} className="btn btn-secondary ml-1">
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </Authenticated>
    );
}
