import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PageTitle from '../common/PageTitle';
import SearchListBox from '../layouts/SearchListBox';
import { search } from '../../api/projectApi';

const SearchPage = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || '';
    
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 검색 실행 함수
    const executeSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        
        setIsLoading(true);
        try {
            const results = await search(projectId, query);
            setSearchResults(results || []);
        } catch (error) {
            console.error('검색 중 오류가 발생했습니다:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // URL 쿼리 파라미터가 변경될 때 검색 실행
    useEffect(() => {
        executeSearch(initialQuery);
    }, [initialQuery, projectId]);

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle 
                title="검색 결과" 
                description={initialQuery ? `"${initialQuery}"에 대한 검색 결과입니다.` : "검색어를 입력하세요."}
            />
            
            {/* 검색 결과 */}
            <SearchListBox 
                results={searchResults} 
                isLoading={isLoading} 
                searchQuery={initialQuery}
            />
        </MainLayout>
    );
};

export default SearchPage;