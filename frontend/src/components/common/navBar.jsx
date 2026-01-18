import { useEffect, useRef, useState } from "react"
import {
  Code2,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, matchPath, useNavigate } from "react-router-dom"

import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { logOut } from "../../services/operations/authAPI"
import { Button } from "../ui/Button"

function Navbar() {
  /* ---------------- REDUX ---------------- */
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  /* ---------------- STATE ---------------- */
  const [catalogOpen, setCatalogOpen] = useState(false)          
  const [catalogPinned, setCatalogPinned] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogItems, setCatalogItems] = useState([]) 
  const [loading, setLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)  

  const catalogRef = useRef(null)
  const profileRef = useRef(null)

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setCatalogItems(res?.data?.data || [])
      } catch (err) {
        console.log("Category fetch error", err)
      }
      setLoading(false)
    })()
  }, [])

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) {
        setCatalogOpen(false)
        setCatalogPinned(false)
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  /* ---------------- CATALOG BEHAVIOR (DESKTOP) ---------------- */
  const handleCatalogClick = () => {
    if (catalogPinned) {
      setCatalogOpen(false)
      setCatalogPinned(false)
    } else {
      setCatalogOpen(true)
      setCatalogPinned(true)
    }
  }

  const handleMouseEnter = () => {
    if (!catalogPinned) setCatalogOpen(true)
  }

  const handleMouseLeave = () => {
    if (!catalogPinned) setCatalogOpen(false)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ]

  /* ---------------- HANDLE LOGOUT ---------------- */
  const handleLogout = () => {
    dispatch(logOut(navigate))
    setShowLogoutConfirm(false) // Close confirmation modal
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-[9999] bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <Code2 className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-xl font-bold text-white group-hover:text-cyan-300">
                EduPlatform
              </span>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium ${
                    matchPath({ path: item.path }, location.pathname)
                      ? "text-cyan-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* CATALOG */}
              <div
                ref={catalogRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={handleCatalogClick}
                  className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Catalog
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      catalogOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {catalogOpen && (
                  <div className="absolute top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                    {loading ? (
                      <p className="text-center text-gray-400">Loading...</p>
                    ) : catalogItems.length > 0 ? (
                      <>
                        {/* All option */}
                        <button
                          onClick={() => {
                            navigate("catalog/all")
                            setCatalogOpen(false)
                            setCatalogPinned(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
                        >
                          All
                        </button>

                        {/* Remaining categories */}
                        {catalogItems.map((item) => (
                          <Link
                            key={item._id}
                            to={`/catalog/${item.name.split(" ").join("-").toLowerCase()}`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
                            onClick={() => {
                              setCatalogOpen(false)
                              setCatalogPinned(false)
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="text-center text-gray-400">No Courses Found</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ================= DESKTOP AUTH ================= */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
                  >
                    <img
                      src={user?.image}
                      alt={user?.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                      <Link
                        to="/dashboard/my-profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => setShowLogoutConfirm(true)}  
                        className="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-300 hover:bg-slate-800 hover:text-red-400"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  matchPath({ path: item.path }, location.pathname)
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-300 hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* MOBILE CATALOG */}
            <div>
              <button
                onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                className="flex justify-between items-center w-full px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg"
              >
                Catalog
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    mobileCatalogOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileCatalogOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {/* All option */}
                  <button
                    onClick={() => {
                      navigate("/catalog/All")
                      setMobileCatalogOpen(false)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-cyan-400"
                  >
                    All
                  </button>

                  {/* Remaining categories */}
                  {catalogItems.map((item) => (
                    <Link
                      key={item._id}
                      to={`/catalog/${item.name.split(" ").join("-").toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-cyan-400"
                      onClick={() => {
                        setMobileCatalogOpen(false)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* MOBILE AUTH */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              {token ? (
                <>
                  <Link
                    to="/dashboard/my-profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" fullWidth>
                      Dashboard
                    </Button>
                  </Link>

                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowLogoutConfirm(true)}  
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" fullWidth className="mb-2">
                      Login
                    </Button>
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
