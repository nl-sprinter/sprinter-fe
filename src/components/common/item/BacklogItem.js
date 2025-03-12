import React from "react";
import WeightIndicator from "../WeightIndicator";

/**
 * @param backlogId
 * @param sprintOrder
 * @param backlogName
 * @param weight
 * @param isFinished
 * @param onClick
 */
const BacklogItem = (props) => {
    const handleClick = () => {
        console.log('BacklogItem 클릭됨:', props.backlogId, props.backlogName);
        if (props.onClick) {
            props.onClick();
        }
    };

    return (
        <div
            key={props.backlogId}
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300
                border border-gray-200 relative overflow-hidden cursor-pointer
                ${props.isFinished 
                    ? 'border-l-4 border-l-gray-300 bg-gray-50 hover:bg-gray-100' 
                    : 'border-l-4 border-l-blue-500 hover:bg-blue-50'
                }`}
            onClick={handleClick}
        >
            {!props.isFinished && (
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-50/80 to-transparent" />
            )}
            <div className="flex items-center gap-2 relative">
                <span className="text-xs text-gray-500">Sprint {props.sprintOrder}</span>
            </div>
            <span className={`flex-1 mx-3 text-sm relative ${props.isFinished ? 'text-gray-500' : ''}`}>
                {props.backlogName}
            </span>
            <div className="flex items-center gap-3 relative">
                <WeightIndicator weight={props.weight} showLabel={false} size="small"/>
                <span className={`px-2 py-1 rounded text-xs ${
                    props.isFinished
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-700'
                }`}>
                    {props.isFinished ? '완료' : '진행중'}
                </span>
            </div>
        </div>
    );
};

export default BacklogItem;