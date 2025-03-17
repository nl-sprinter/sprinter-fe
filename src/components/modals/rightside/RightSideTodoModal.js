import React from 'react';
import RightSideModal from './RightSideModal';

const RightSideTodoModal = ({ open, onClose }) => {
    const todos = [
        { project: 'proj1', task: 'Sprint3 - Do Task 1', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Sprint3 - Do Task 2', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Calendar - 팀 회식', status: '(0-3)', color: '#4CAF50' },
    ];

    return (
        <RightSideModal
            isOpen={open}
            onClose={onClose}
            title="Todo List"
            contentLabel="Todo Modal"
        >
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-grow">
                            <p className="text-sm text-gray-600">{todo.project}</p>
                            <p>{todo.task} {todo.status}</p>
                        </div>
                        <div 
                            className="w-8 h-8 rounded bg-green-500 text-white flex items-center justify-center ml-3"
                            style={{ backgroundColor: todo.color }}
                        >
                            P
                        </div>
                    </li>
                ))}
            </ul>
        </RightSideModal>
    );
};

export default RightSideTodoModal;
