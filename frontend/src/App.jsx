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
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import FicheDetail from "./pages/FicheDetail";
import FicheForm from "./pages/FicheForm";
import UsefulNumberForm from "./pages/UsefulNumberForm";
import NumberCategoryForm from "./pages/NumberCategoryForm";
import TopicForm from "./pages/TopicForm";
import Admin from "./pages/Admin"; // Le Tableau de bord (/admin)
import AdminCategories from "./pages/AdminCategories"; // (/admin/categories)
import AdminUsers from "./pages/AdminUsers"; // (/admin/users)
import AdminSettings from "./pages/AdminSettings";
import Moderation from "./pages/Moderation";

import './App.css'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CategoryProvider>
          <UserProvider>
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
                  <Route path="/resources/new" element={<FicheForm />} />
                  <Route path="/resources/edit/:slug" element={<FicheForm />} />
                  <Route path="/numbers/new" element={<UsefulNumberForm />} />
                  <Route path="/numbers/edit/:id" element={<UsefulNumberForm />} />
                  <Route path="/numbers/categories/new" element={<NumberCategoryForm />} />
                  <Route path="/numbers/categories/edit/:id" element={<NumberCategoryForm />} />
                  <Route path="/topics/new" element={<TopicForm />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="admin/categories" element={<AdminCategories />} />
                  <Route path="admin/users" element={<AdminUsers />} />
                  <Route path="admin/settings" element={<AdminSettings />} />
                  <Route path="moderation" element={<Moderation />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </CategoryProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App
