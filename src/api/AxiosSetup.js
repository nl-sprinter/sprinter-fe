import { useEffect } from 'react';
import { useLoading } from '../components/modals/global/LoadingModal';
import { useError } from '../components/modals/global/ErrorModal';
import { setLoadingHandler, setErrorHandler } from './axiosInstance';

const AxiosSetup = ({ children }) => {
    const { setIsLoading } = useLoading();
    const { showError } = useError();

    useEffect(() => {
        setLoadingHandler(setIsLoading);
        setErrorHandler(showError);
    }, [setIsLoading, showError]);

    return children;
};

export default AxiosSetup; 