import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/Home';
import Chat from './components/Chat';
import { LoadingContextProvider } from './components/Context';
import Loading from './components/Loading';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <LoadingContextProvider>
      <Loading />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomname" element={<Chat />} />
        </Routes>
      </Router>
      <ToastContainer />
    </LoadingContextProvider>
  );
}

export default App;