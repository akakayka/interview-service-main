import ReactDOM from 'react-dom/client';
import App from 'app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './app/styles/index.scss';
import { StoreProvider } from 'app/providers/StoreProvider/ui/StoreProvider.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Не найден root элемент.');
}

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <StoreProvider>
            <App />
            <ToastContainer
                autoClose={3000}
                limit={3}
                draggable={true}
                position={'top-right'}
                closeButton={true}
                theme={'light'}
                hideProgressBar={true}
            />
        </StoreProvider>
    </BrowserRouter>,
);
