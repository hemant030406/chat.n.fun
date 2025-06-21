import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/Home';
import Chat from './components/Chat';
import { LoadingContextProvider } from './components/Context';
import Loading from './components/Loading';

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
    </LoadingContextProvider>
  );
}

export default App;