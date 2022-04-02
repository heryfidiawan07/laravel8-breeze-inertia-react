import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
// import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    // console.log('errors', errors)
    // console.log('status', status)
    // console.log('data', data)

    return (
        <Guest>
            <Head title="Log in" />

            {/* {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>} */}

            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                        <div className="login-brand">
                            <img src="assets/img/stisla-fill.svg" alt="logo" width="100" className="shadow-light rounded-circle"/>
                        </div>

                        <div className="card card-primary">
                            <div className="card-header"><h4>Login</h4></div>
                            <div className="card-body">
                                
                                {/* <ValidationErrors errors={errors} /> */}

                                <form onSubmit={submit} className="needs-validation">
                                    <div className="form-group">
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
                                    <div className="form-group">
                                        <Label 
                                            forInput="password" 
                                            value="Password" 
                                            className={'control-label'} 
                                            rightValue={
                                                canResetPassword && (
                                                    <Link
                                                        href={route('password.request')}
                                                        className="text-small"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                )
                                            }
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
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox">
                                            <Checkbox 
                                                id="remember-me"
                                                name="remember" 
                                                checked={data.remember} 
                                                handleChange={onHandleChange} 
                                                label={`Remember me`}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Button className="btn btn-primary btn-lg btn-block" processing={processing}>
                                            Log in
                                        </Button>
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
                            Don't have an account ? 
                            <Link href={route('register')}> Register</Link>
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
