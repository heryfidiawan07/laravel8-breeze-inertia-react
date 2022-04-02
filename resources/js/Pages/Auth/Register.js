import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <Guest>
            <Head title="Register" />

            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
                        <div className="login-brand">
                            <img src="assets/img/stisla-fill.svg" alt="logo" width="100" className="shadow-light rounded-circle"/>
                        </div>

                        <div className="card card-primary">
                            <div className="card-header"><h4>Login</h4></div>
                            <div className="card-body">
                                
                                {/* <ValidationErrors errors={errors} /> */}

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
                                                error={errors.email}
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
                                                error={errors.password_confirmation}
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <div className="custom-control custom-checkbox">
                                                <Checkbox 
                                                    id="agree-me"
                                                    name="agree" 
                                                    checked={data.agree} 
                                                    handleChange={onHandleChange} 
                                                    label={`I agree with the terms and conditions`}
                                                />
                                            </div>
                                            <Button className="btn btn-primary btn-lg btn-block" processing={processing}>
                                                Register
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                                <div className="text-center mt-4 mb-3">
                                    <div className="text-job text-muted">Login With Social</div>
                                </div>
                                <div className="row sm-gutters">
                                    <div className="col-6">
                                        <a className="btn btn-block btn-social btn-facebook">
                                            <span className="fab fa-facebook"></span> Facebook
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a className="btn btn-block btn-social btn-twitter">
                                            <span className="fab fa-twitter"></span> Twitter
                                        </a>                                
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 text-muted text-center">
                            <Link href={route('login')}> Already Register</Link>
                        </div>
                        <div className="simple-footer">
                            Copyright &copy; Stisla 2018
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    );
}
