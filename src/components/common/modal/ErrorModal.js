import { createContext, useContext, useState } from 'react';
import { IoMdClose } from "react-icons/io";

const ErrorContext = createContext();

export const ErrorModal = ({ children }) => {
    const [error, setError] = useState(null);

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {error && (
                <div className="fixed bottom-4 right-4 bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-red-500 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-700">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <IoMdClose size={20} />
                        </button>
                    </div>
                </div>
            )}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorModal component');
    }
    return context;
}; 