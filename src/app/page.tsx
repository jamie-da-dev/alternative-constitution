import Navbar from "./components/Navbar";
import Index from "./components/Index";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Index />
      <Footer />
    </div>
  );
}
