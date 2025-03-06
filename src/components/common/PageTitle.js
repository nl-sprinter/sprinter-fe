import React from 'react';

const PageTitle = ({ title, description, rightContent }) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                {rightContent}
            </div>
            {description && (
                <p className="text-gray-600 mt-2">{description}</p>
            )}
        </div>
    );
};

export default PageTitle;