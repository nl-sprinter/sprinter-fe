import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {logout} from "../../api/authApi";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/", {replace: true});
    }, [navigate]);
    return null;
}

export default Logout;