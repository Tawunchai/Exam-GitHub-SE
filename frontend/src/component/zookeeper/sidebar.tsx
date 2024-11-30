import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { LayoutDashboard, ClipboardPlus, Layers, BookUser, Calendar, LifeBuoy, Settings, PawPrint, Beef, LogOut } from "lucide-react";
import logo from "../../assets/logotest.png";
import profile from "../../assets/logoemail.png";
import { createContext, useContext, useState, ReactNode, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"; // Import Ant Design message

// Define context type
type SidebarContextType = {
    expanded: boolean;
};

// Define Sidebar item props type
interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
    to: string;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

const Sidebar: FC = () => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove login information from localStorage
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userRole");

        // Show success message
        message.success("Logout successfully!");

        // Navigate to login page after showing message
        setTimeout(() => {
            navigate("/login");
        }, 3500); // 2 seconds delay
    };

    return (
        <SidebarContext.Provider value={{ expanded }}>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img
                            src={logo}
                            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
                            alt="Logo"
                        />
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-100"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <ul className="flex-1 px-3">
                        <SidebarItem icon={<PawPrint size={20} />} text="Animal" to="/zookeeper" />
                        <SidebarItem icon={<LayoutDashboard size={20} />} text="Habitat" to="/zookeeper/habitat" />
                        <SidebarItem icon={<ClipboardPlus size={20} />} text="Report" to="/zookeeper/report" />
                        <SidebarItem icon={<Calendar size={20} />} text="Calendar" to="/zookeeper/calendar" />
                        <SidebarItem icon={<Layers size={20} />} text="Event" to="/zookeeper/event" />
                        <SidebarItem icon={<BookUser size={20} />} text="Work" to="/zookeeper/work" />
                        <SidebarItem icon={<Beef size={20} />} text="Stock" to="/zookeeper/stock" />
                        <hr className="my-3" />
                        <SidebarItem icon={<Settings size={20} />} text="MyTicket" to="/zookeeper/myticket" />
                        <SidebarItem icon={<LifeBuoy size={20} />} text="Review" to="/zookeeper/review" />
                        <li
                            onClick={handleLogout}
                            className="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-orange-50 text-gray-600"
                        >
                            <LogOut size={20} />
                            <span className={`overflow-hidden transition-all ${expanded ? "ml-3" : "w-0"}`}>Logout</span>
                        </li>
                    </ul>

                    <div className="border-t flex p-3">
                        <img src={profile} style={{ width: "80px" }} alt="Profile" />
                        <div
                            className={`flex justify-between items-center overflow-hidden transition-all ${
                                expanded ? "w-90 ml-3" : "w-0"
                            }`}
                        >
                            <div className="leading-4" style={{ marginRight: "15px" }}>
                                <h4 className="font-semibold">Zookeeper</h4>
                                <span className="text-xs text-gray-600">zookeeper@gmail.com</span>
                            </div>
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </nav>
            </aside>
        </SidebarContext.Provider>
    );
};

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, active = false, alert = false, to }) => {
    const { expanded } = useContext(SidebarContext);

    return (
        <Link to={to}>
            <li
                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group 
                ${active ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-800" : "hover:bg-orange-50 text-gray-600"}`}
            >
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
                {alert && (
                    <div className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${expanded ? "" : "top-2"}`}></div>
                )}
                {!expanded && (
                    <div
                        className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-orange-100 text-orange-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                    >
                        {text}
                    </div>
                )}
            </li>
        </Link>
    );
};

export default Sidebar;
