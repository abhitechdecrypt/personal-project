import React from 'react';

const NotAuthorized = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-red-400">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
                <p className="text-lg">You do not have permission to view this page.</p>
            </div>
        </div>
    );
};

export default NotAuthorized;
