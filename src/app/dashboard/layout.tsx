import { Sidebar } from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen flex">
	<Sidebar />
  	<div className="w-full p-4 max-h-screen overflow-y-auto">{children}</div>
  </div> ;
}