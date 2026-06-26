import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconHome,IconCreate, IconWall, IconProfile } from './NavIcons'
import '../styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
<button
  className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
  onClick={() => navigate('/dashboard')}
  title="Home"
>
  <IconHome />
  <span className="nav-label">Home</span>
</button>

<button
  className={`nav-item nav-create ${isActive('/create') ? 'active' : ''}`}
  onClick={() => navigate('/create')}
  title="Create"
>
  <IconCreate />
  <span className="nav-label">Create</span>
</button>

<button
  className={`nav-item ${isActive('/wall') ? 'active' : ''}`}
  onClick={() => navigate('/wall')}
  title="Wall"
>
  <IconWall />
  <span className="nav-label">Wall</span>
</button>

<button
  className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
  onClick={() => navigate('/profile')}
  title="Profile"
>
  <IconProfile />
  <span className="nav-label">Profile</span>
</button>
</div>
</nav>
)};