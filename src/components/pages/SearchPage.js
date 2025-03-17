import React  from 'react';
import MainLayout from "../layouts/MainLayout";
import SearchListBox from "../layouts/SearchListBox";
import PageTitle from "../common/PageTitle";
import {SearchCard} from "../common/SearchCard";
import {useParams} from "react-router-dom";

const SearchPage = () => {
    const { searchResult } = useParams();


    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle title="검색 결과" />
            <SearchListBox>
                <SearchCard
                    type={searchResult.type}
                    content={searchResult.content}

                />
                <SearchCard />
                <SearchCard />
            </SearchListBox>
        </MainLayout>
    );
}

export default SearchPage;