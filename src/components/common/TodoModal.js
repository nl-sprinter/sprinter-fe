import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 50
    },
    content: {
        top: '0',
        right: '0',
        bottom: '0',
        left: 'auto',
        width: '300px',
        margin: '0',
        padding: '20px',
        border: '0px solid',
        borderRadius: '0',
        transform: 'none',
        position: 'fixed'
    }
};

const TodoModal = ({ open, onClose }) => {
    const todos = [
        { project: 'proj1', task: 'Sprint3 - Do Task 1', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Sprint3 - Do Task 2', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Calendar - 팀 회식', status: '(0-3)', color: '#4CAF50' },
    ];

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Todo Modal"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Todo List</h2>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX className="text-xl text-gray-600" />
                </button>
            </div>
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
        </Modal>
    );
};

export default TodoModal;
