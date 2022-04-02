import React from 'react';

export default function Label({ forInput, value, className, children, rightValue }) {
    return (
        <React.Fragment>
            <label htmlFor={forInput} className={` ` + className}>
                {value ? value : { children }}
            </label>
            {rightValue && (
                <div className="float-right">
                    {rightValue}
                </div>
            )}
        </React.Fragment>
    );
}
