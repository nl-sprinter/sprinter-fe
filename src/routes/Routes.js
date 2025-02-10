import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateRoute from '../components/auth/PrivateRoute';
import PublicRoute from '../components/auth/PublicRoute';
import NotFoundPage from '../components/pages/NotFoundPage';

// 로그인 전 페이지
import LandingPage from '../components/pages/LandingPage';
import LoginPage from '../components/pages/LoginPage';
import SignUpPage from '../components/pages/SignUpPage';
import AccountPage from '../components/pages/AccountPage';

// 프로젝트 외부 페이지
import HomePage from '../components/pages/HomePage';
import StartingFormPage from '../components/pages/StartingFormPage';

// 프로젝트 내부 페이지
import OverviewPage from '../components/pages/OverviewPage';
import ProductBacklogPage from '../components/pages/ProductBacklogPage';
import SprintPage from '../components/pages/SprintPage';
import CalendarPage from '../components/pages/CalendarPage';
import Logout from "../components/auth/Logout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                // 로그인 전 페이지
                <Route path="/" element={
                    <PublicRoute>
                        <LandingPage/>
                    </PublicRoute>
                }/>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage/>
                    </PublicRoute>
                }/>
                <Route path="/signup" element={
                    <PublicRoute>
                        <SignUpPage/>
                    </PublicRoute>
                }/>


                // 프로젝트 외부 페이지
                <Route path="/home" element={
                    <PrivateRoute>
                        <HomePage/>
                    </PrivateRoute>
                }/>
                <Route path="/startingform" element={
                    <PrivateRoute>
                        <StartingFormPage/>
                    </PrivateRoute>
                }/>
                <Route path="/account" element={
                    <PrivateRoute>
                        <AccountPage/>
                    </PrivateRoute>
                }/>

                // 프로젝트 내부 페이지
                <Route path="/overview" element={
                    <PrivateRoute>
                        <OverviewPage showSidebar/>
                    </PrivateRoute>
                }/>
                <Route path="/productbacklog" element={
                    <PrivateRoute>
                        <ProductBacklogPage showSidebar/>
                    </PrivateRoute>
                }/>
                <Route path="/sprint" element={
                    <PrivateRoute>
                        <SprintPage showSidebar/>
                    </PrivateRoute>
                }/>
                <Route path="/calendar" element={
                    <PrivateRoute>
                        <CalendarPage showSidebar/>
                    </PrivateRoute>
                }/>

                // 로그아웃
                <Route path="/logout" element={
                    <PrivateRoute>
                        <Logout/>
                    </PrivateRoute>
                }/>

                // 404 페이지 - 항상 마지막에 위치해야 함
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
