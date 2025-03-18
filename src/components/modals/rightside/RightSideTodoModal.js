import React, {useEffect, useState} from 'react';
import RightSideModal from './RightSideModal';
import {
    getTodos
} from '../../../api/todoApi';
import {NotificationCard} from "../../common/NotificationCard";
import {TodoCard} from "../../common/TodoCard";

const RightSideTodoModal = ({ open, onClose }) => {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTodos = async () => {
        setIsLoading(true);
        try {
            const results = await getTodos();
            setTodos(results || []);
        } catch (error) {
            console.error('RightSideTodoModal.fetchTodos 에러: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    // 모달이 열릴 때 todo 목록 가져오기
    useEffect(() => {
        if (open) {
            fetchTodos();
        }
    }, [open]);


    return (
        <RightSideModal
            isOpen={open}
            onClose={onClose}
            title="Todo"
            contentLabel="Todo Modal"
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : todos.length > 0 ? (
                <div className="space-y-3 py-2">
                    {todos.map((t) => (
                        <TodoCard
                            key={t.id}
                            todoType={t.todoType}
                            content={t.content}
                            url={t.url}
                            projectId={t.projectId}
                            projectName={t.projectName}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p>Todo 가 없습니다</p>
                </div>
            )}
        </RightSideModal>
    );
};

export default RightSideTodoModal;
