import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Building2, 
  TrendingUp,
  Folder,
  ClipboardList
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: '/',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      roles: ['Admin', 'Finance Manager', 'Project Manager']
    },
    {
      path: '/projects',
      icon: <Folder size={20} />,
      label: 'Projects',
      roles: ['Admin', 'Project Manager']
    },
    {
      path: '/finance',
      icon: <DollarSign size={20} />,
      label: 'Finance Dashboard',
      roles: ['Admin', 'Finance Manager']
    },
    {
      path: '/general-ledger',
      icon: <FileText size={20} />,
      label: 'General Ledger',
      roles: ['Admin', 'Finance Manager']
    },
    {
      path: '/invoices',
      icon: <ClipboardList size={20} />,
      label: 'Invoices',
      roles: ['Admin', 'Finance Manager', 'Project Manager']
    },
    {
      path: '/customers',
      icon: <Building2 size={20} />,
      label: 'Customers & Vendors',
      roles: ['Admin', 'Finance Manager']
    },
    {
      path: '/reports',
      icon: <BarChart3 size={20} />,
      label: 'Financial Reports',
      roles: ['Admin', 'Finance Manager']
    },
    {
      path: '/ai-insights',
      icon: <TrendingUp size={20} />,
      label: 'AI Insights',
      roles: ['Admin', 'Finance Manager', 'Project Manager']
    },
    {
      path: '/admin',
      icon: <Users size={20} />,
      label: 'Administration',
      roles: ['Admin']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
