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
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Tes futures pages viendront ici (ex: <Route path="categories" element={<Categories />} />) */}
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

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
