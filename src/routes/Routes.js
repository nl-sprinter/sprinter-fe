import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateRoute from '../components/auth/PrivateRoute';
import PublicRoute from '../components/auth/PublicRoute';
import ProjectLeaderRoute from './ProjectLeaderRoute';
import NotFoundPage from '../components/pages/NotFoundPage';


// 로그인 전 페이지
import LandingPage from '../components/pages/LandingPage';
import LoginPage from '../components/pages/LoginPage';
import SignUpPage from '../components/pages/SignUpPage';
import AccountPage from '../components/pages/AccountPage';

// 프로젝트 외부 페이지
import HomePage from '../components/pages/HomePage';
import StartingFormPage from '../components/pages/StartingFormPage';
import BacklogConfirmPage from '../components/pages/BacklogConfirmPage';

// 프로젝트 내부 페이지
// 오버뷰
import OverviewPage from '../components/pages/OverviewPage';
// 백로그
import ProductBacklogPage from '../components/pages/ProductBacklogPage';
// 스프린트
import SprintPage from '../components/pages/SprintPage';
import SprintEachPage from '../components/pages/SprintEachPage';
import SprintSettingsPage from '../components/pages/SprintSettingsPage';
// 캘린더
import CalendarPage from '../components/pages/CalendarPage';
import ProjectSettingsPage from '../components/pages/ProjectSettingsPage';

// 로그아웃
import Logout from "../components/auth/Logout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인 전 페이지 */}
                <Route path="/" element={
                    <PublicRoute>
                        <LandingPage/>
                    </PublicRoute>
                }/>

                {/* 로그인 */}
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage/>
                    </PublicRoute>
                }/>

                {/* 회원가입 */}
                <Route path="/signup" element={
                    <PublicRoute>
                        <SignUpPage/>
                    </PublicRoute>
                }/>


                {/* 로그인 후 페이지 */}   

                {/* 프로젝트 외부 페이지 */}
                <Route path="/home" element={
                    <PrivateRoute>
                        <HomePage/>
                    </PrivateRoute>
                }/>

                {/* 프로젝트 시작 페이지 */}
                <Route path="/startingform" element={
                    <PrivateRoute>
                        <StartingFormPage/>
                    </PrivateRoute>
                }/>

                {/* 백로그 확인 페이지 */}
                <Route path="/backlogconfirm" element={
                    <PrivateRoute>
                        <BacklogConfirmPage/>
                    </PrivateRoute>
                }/>

                {/* 계정 페이지 */}
                <Route path="/account" element={
                    <PrivateRoute>
                        <AccountPage/>
                    </PrivateRoute>
                }/>

                {/* 프로젝트 내부 페이지 */}
                <Route path="/projects/:projectId/overview" element={
                    <PrivateRoute>
                        <OverviewPage showSidebar/>
                    </PrivateRoute>
                }/>

                {/* 프로젝트 설정 */}
                <Route path="/projects/:projectId/overview/settings" element={
                    <PrivateRoute>
                        <ProjectLeaderRoute>
                            <ProjectSettingsPage showSidebar/>
                        </ProjectLeaderRoute>
                    </PrivateRoute>
                }/>

                {/* 프로덕트 백로그 */}
                <Route path="/projects/:projectId/productbacklog" element={
                    <PrivateRoute>
                        <ProductBacklogPage showSidebar/>
                    </PrivateRoute>
                }/>

                {/* 스프린트 */}
                <Route path="/projects/:projectId/sprints" element={
                    <PrivateRoute>
                        <SprintPage showSidebar/>
                    </PrivateRoute>
                
                }/>
                
                {/* 스프린트 설정 */}
                <Route path="/projects/:projectId/sprints/settings" element={
                    <PrivateRoute>
                        <ProjectLeaderRoute>
                            <SprintSettingsPage showSidebar/>
                        </ProjectLeaderRoute>
                    </PrivateRoute>
                }/>

                {/* 스프린트 상세 */}
                <Route path="/projects/:projectId/sprints/:sprintId" element={
                    <PrivateRoute>
                        <SprintEachPage showSidebar/>
                    </PrivateRoute>
                }/>

                {/* 캘린더 */}
                <Route path="/projects/:projectId/calendar" element={
                    <PrivateRoute>
                        <CalendarPage showSidebar/>
                    </PrivateRoute>
                }/>

                {/* 로그아웃 */}
                <Route path="/logout" element={
                    <PrivateRoute>
                        <Logout/>
                    </PrivateRoute>
                }/>


                {/* // 404 페이지 - 항상 마지막에 위치해야 함 */}
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
