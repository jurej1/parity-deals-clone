import NavBar from "./_components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blue-500/5 min-h-screen">
      <NavBar />
      <div className="container">{children}</div>
    </div>
  );
}
