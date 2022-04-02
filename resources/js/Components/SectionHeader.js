import React from 'react';

export default function SectionHeader({ title }) {
    return (
        <div className="section-header">
            <h1>{title}</h1>
            <div className="section-header-breadcrumb">
                <div className="breadcrumb-item"><a href="#">Home</a></div>
                <div className="breadcrumb-item"><a href="#">Page</a></div>
                <div className="breadcrumb-item active">Current</div>
            </div>
        </div>
    );
}
