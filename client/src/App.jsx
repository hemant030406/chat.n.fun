import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/Home';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:roomname" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;