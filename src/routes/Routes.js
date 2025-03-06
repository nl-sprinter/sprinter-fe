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
import BacklogConfirmPage from '../components/pages/BacklogConfirmPage';

// 프로젝트 내부 페이지
// 오버뷰
import OverviewPage from '../components/pages/OverviewPage';
// 백로그
import ProductBacklogPage from '../components/pages/ProductBacklogPage';
// 스프린트
import SprintPage from '../components/pages/SprintPage';
import SprintEachPage from '../components/pages/SprintEachPage';
// 캘린더
import CalendarPage from '../components/pages/CalendarPage';


// 로그아웃
import Logout from "../components/auth/Logout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* //// 로그인 전 페이지 */}
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


                {/* //// 로그인 후 페이지 */}   

                {/* // 프로젝트 외부 페이지 */}
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
                <Route path="/backlogconfirm" element={
                    <PrivateRoute>
                        <BacklogConfirmPage/>
                    </PrivateRoute>
                }/>
                <Route path="/account" element={
                    <PrivateRoute>
                        <AccountPage/>
                    </PrivateRoute>
                }/>

                {/* // 프로젝트 내부 페이지 */}
                <Route path="/project/:projectId" element={<PrivateRoute><OverviewPage showSidebar/></PrivateRoute>}/>
                <Route path="/project/:projectId/overview" element={<PrivateRoute><OverviewPage showSidebar/></PrivateRoute>}/>
                <Route path="/project/:projectId/productbacklog" element={<PrivateRoute><ProductBacklogPage showSidebar/></PrivateRoute>}/>
                <Route path="/project/:projectId/sprint" element={<PrivateRoute><SprintPage showSidebar/></PrivateRoute>}/>
                <Route path="/project/:projectId/sprint/:sprintId" element={<PrivateRoute><SprintEachPage showSidebar/></PrivateRoute>}/>
                <Route path="/project/:projectId/calendar" element={<PrivateRoute><CalendarPage showSidebar/></PrivateRoute>}/>

                {/* // 로그아웃 */}
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
