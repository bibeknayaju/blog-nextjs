import { HeroSection } from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PostsGrid from "@/components/PostsGrid";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mx-auto">
        <HeroSection />
        <PostsGrid />
      </div>
    </div>
  );
}
