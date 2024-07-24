import Navbar from "@/components/Navbar";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mx-auto">
        {children}
      </div>
    </div>
  );
}

export default HomeLayout;
