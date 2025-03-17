import React from 'react';
import SearchCard from '../common/SearchCard';

const SearchListBox = ({ results, isLoading, searchQuery }) => {
    // 검색 결과가 없을 때 표시할 메시지
    const renderEmptyState = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-gray-500">검색 중입니다...</p>
                </div>
            );
        }
        
        if (!searchQuery) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p className="text-gray-500">검색어를 입력하세요</p>
                </div>
            );
        }
        
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-500">'{searchQuery}'에 대한 검색 결과가 없습니다</p>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 검색 결과 헤더 */}
            {results.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-sm font-medium text-gray-600">
                        '{searchQuery}'에 대한 검색 결과 ({results.length}개)
                    </h2>
                </div>
            )}
            
            {/* 검색 결과 목록 */}
            <div className="h-full overflow-y-auto">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <SearchCard key={index} result={result} />
                    ))
                ) : (
                    renderEmptyState()
                )}
            </div>
        </div>
    );
};

export default SearchListBox;