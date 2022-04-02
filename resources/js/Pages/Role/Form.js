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
    // console.log('role form props', props)

    const { data, setData, processing, errors } = useForm({
        name: props.method == 'PUT' ? props.role.name : '',
        permissions: props.method == 'PUT' ? props.rolePermissions : [],
    });

    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        if(redirect === true) {
            Inertia.get(route('role.index'))
        }
    }, [redirect])

    const onHandleChange = (e) => {
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

    const submit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('_method', props.method)
        for (const [key, value] of Object.entries(data)) {
            if(key == 'permissions') {
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
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Form</h2>}
        >
            <Head title="Role Form" />

            <section className="section">
                <SectionHeader title="Role Management" />
                <div className="section-body">
                    <h2 className="section-title">Title</h2>
                    <p className="section-lead">Example of some Bootstrap table components.</p>

                    <div className="card p-3">
                        <form onSubmit={submit} className="needs-validation">
                            <div className="form-group">
                                <Label forInput="name" value="Name" className={'control-label'} />
                                <Input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    autoComplete="current-email"
                                    handleChange={onHandleChange}
                                    required={true}
                                    error={errors.email}
                                />
                            </div>
                            <div className="form-group">
                                <Label  
                                    value="Permissions" 
                                    className={'control-label mb-3'} 
                                />

                                {errors.permissions && <div className="text-danger">{errors.permissions}</div>}

                                {props.permissions.map(permission => {
                                    return(
                                        <div className="mt-3" key={permission.id}>
                                            <h6>{permission.name}</h6>
                                            <div className="form-check form-check-inline">
                                                {permission.children.map((child, index) => {
                                                    return (
                                                        <Checkbox 
                                                            key={index}
                                                            id={child.id}
                                                            name="permissions" 
                                                            value={child.name} 
                                                            checkboxClass={`form-check-input`}
                                                            labelClass={`form-check-label mr-3`}
                                                            handleChange={onHandleChange} 
                                                            checked={data.permissions.includes(child.name)}
                                                            label={child.name}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-primary px-4" processing={processing}>
                                    Save
                                </Button>
                                <Link href={route('role.index')} className="btn btn-secondary ml-1">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </Authenticated>
    );
}
