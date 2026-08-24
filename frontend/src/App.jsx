import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import UpcomingEvents from "./pages/Events";
import PastEvents from "./pages/PastEvents";
import Announcements from "./pages/Announcements";
import Members from "./pages/Members";
import Resources from "./pages/Resources";
import Numbers from "./pages/Numbers";
import CategoryDetail from "./pages/CategoryDetail";
import SubcategoryDetail from "./pages/SubcategoryDetail";
import TopicDetail from "./pages/TopicDetail";
import Register from "./pages/Register";
import ProfileDetail from "./pages/ProfileDetail";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext.jsx";
import FicheDetail from "./pages/FicheDetail";
import './App.css'

function App() {
  return (
    <AuthProvider> {/* 👈 2. On enveloppe TOUT le site ici */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />
            <Route path="members" element={<Members />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:slug" element={<CategoryDetail />} />
            <Route path="/categories/:categorySlug/:slug" element={<SubcategoryDetail />} />
            <Route path="events" element={<UpcomingEvents />} />
            <Route path="events/past" element={<PastEvents />} />
            <Route path="resources" element={<Resources />} />
            <Route path="resources/numbers" element={<Numbers />} />
            <Route path="topics/:topicSlug" element={<TopicDetail />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="profile/:username" element={<ProfileDetail />} />
            <Route path="fiches/:slug" element={<FicheDetail />} />
            FicheDetail
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
