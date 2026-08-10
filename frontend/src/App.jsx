import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import EmailLogin from "./pages/EmailLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-login" element={<EmailLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;