import React from 'react';

const CardBox = (props) => {
    return (
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            {props.children}
        </div>
    );
}

export default CardBox;