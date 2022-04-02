import React, { useEffect, useRef } from 'react';

export default function Input({
    type = 'text',
    name,
    value,
    className,
    autoComplete,
    required,
    isFocused,
    handleChange,
    error,
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <React.Fragment>
            <input
                type={type}
                name={name}
                value={value}
                className={
                    `form-control ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
            />
            {error && (
                <div className={error.length ? `text-danger` : `invalid-feedback`}>
                    {error}
                </div>
            )}
        </React.Fragment>
    );
}
