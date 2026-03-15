import { Navigate, Route, Routes } from "react-router-dom";

import AuthToastSync from "./components/AuthToastSync";
import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import VideoDetailPage from "./pages/VideoDetailPage";

function App() {
  return (
    <Layout>
      <AuthToastSync />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/upload" element={<UploadVideoPage />} />
        <Route path="/videos/:id" element={<VideoDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
