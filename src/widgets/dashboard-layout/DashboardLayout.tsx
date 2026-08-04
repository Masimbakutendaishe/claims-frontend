import { Sidebar } from '../sidebar/Sidebar'
import { NavBar } from '../nav-bar/NavBar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex bg-white dark:bg-[#0B1533]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}