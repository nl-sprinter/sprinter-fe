import { useEffect } from 'react';
import { useLoading } from '../components/common/LoadingModal';
import { useError } from '../components/common/ErrorModal';
import { setLoadingHandler, setErrorHandler } from './axiosConfig';

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