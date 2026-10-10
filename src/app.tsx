import { Routes, Route } from 'react-router';
import Navbar from './ui/nav.tsx';
import Footer from './ui/footer.tsx';
import Home from './pages/home/home.tsx';
import NotFound from './pages/not-found/not-found.tsx';

/**
 * Router is in place even though the site is currently a single page,
 * so future routes (e.g. a blog or shop) can be added without restructuring.
 * Just add another <Route> below.
 */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here as the site grows, e.g.:
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
          */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
