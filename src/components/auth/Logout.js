import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {logout} from "../../api/authApi";
import {useUserStore} from "../../store/useUserStore";
import {useUserProjectStore} from "../../store/useUserProjectStore";

const Logout = () => {
    const navigate = useNavigate();
    const {clearUser} = useUserStore();
    const {clearProjects} = useUserProjectStore();

    useEffect(() => {
        logout();
        clearUser();
        clearProjects();
        navigate("/", {replace: true});
    }, [navigate, clearUser, clearProjects]);
    return null;
}

export default Logout;