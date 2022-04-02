import React from 'react';

export default function Checkbox({ name, id, value, handleChange, checkboxClass, labelClass, label, checked=false, disabled=false }) {
    return (
        <React.Fragment>
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                className={checkboxClass || `custom-control-input`}
                onChange={async (e) => handleChange(e)}
                checked={checked}
                disabled={disabled}
            />
            <label className={labelClass || `custom-control-label`} htmlFor={id}>{label}</label>
        </React.Fragment>
    );
}
