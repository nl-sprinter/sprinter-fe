import React from 'react';

const DailyScrumItem = (props) => {
    return (
        <div
            key={props.id}
            className="p-2 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">{props.date}</span>
            </div>
            <p className="text-sm text-gray-700">{props.content}</p>
        </div>
    );
}

export default DailyScrumItem;