import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import BasketIcon from "@mui/icons-material/ShoppingBasket";
import ProfileIcon from "@mui/icons-material/Person";
import useFocusTrap from "../hooks/useFocusTrap";
import NotificationIcon from "@mui/icons-material/Notifications";
import HeartIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import "../styles/layout.css";
import "../styles/styles.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTopMenu, setActiveTopMenu] = useState("");
  const [localFavorites, setLocalFavorites] = useState([]);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [favoritesNew, setFavoritesNew] = useState(false);
  const [notificationsNew, setNotificationsNew] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const basket = useSelector((s) => s.basket || { items: [] });

  // Trap focus within nav when menu is open
  useFocusTrap(navRef, isMenuOpen, { onDeactivate: closeMenu });

  // In case menu is open, disable body scroll
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    return undefined;
  }, [isMenuOpen]);

  // This for initialize auth state from localStorage
  //  and listen for changes dispatched by login/logout
  useEffect(() => {
    const read = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    read();
    const handler = () => read();
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  // Logout handler
  const handleLogout = () => {
    // clear auth storage, update local state and navigate home
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChanged")); // notify other parts of the app
    navigate("/");
  };

  // Check for phone mode based on window width
  useEffect(() => {
    const checkPhoneMode = () => {
      setIsPhoneMode(window.innerWidth <= 768);
    };
    checkPhoneMode();
    window.addEventListener("resize", checkPhoneMode);
    return () => window.removeEventListener("resize", checkPhoneMode);
  }, []);

  // Top menu toggles — wrapped so opening a dropdown marks items as seen
  const markFavoritesSeen = () => {
    try {
      const favCount = (localFavorites || []).length || 0;
      localStorage.setItem("lastSeenFavorites", String(favCount));
    } catch (e) {}
    setFavoritesNew(false);
  };

  const markNotificationsSeen = () => {
    try {
      const notCount = (localNotifications || []).length || 0;
      localStorage.setItem("lastSeenNotifications", String(notCount));
    } catch (e) {}
    setNotificationsNew(false);
  };

  const toggleTopMenu = (menu) => {
    const willOpen = activeTopMenu !== menu;
    setActiveTopMenu((prev) => (prev === menu ? "" : menu));
    if (willOpen) {
      if (menu === "favorites") markFavoritesSeen();
      if (menu === "notification") markNotificationsSeen();
    }
  };

  // reads local data for dropdowns
  const refreshLocalLists = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setLocalFavorites((u && u.favorites) || []);
    } catch (e) {
      setLocalFavorites([]);
    }
    // basket moved to Redux; header reads from store directly
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setLocalNotifications((u && u.notifications) || []);
    } catch (e) {
      setLocalNotifications([]);
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
      const favCount = (storedUser.favorites || []).length || 0;
      const notCount = (storedUser.notifications || []).length || 0;

      if (!localStorage.getItem("lastSeenFavorites")) {
        localStorage.setItem("lastSeenFavorites", "0");
      }
      if (!localStorage.getItem("lastSeenNotifications")) {
        localStorage.setItem("lastSeenNotifications", "0");
      }

      const lastFav =
        parseInt(localStorage.getItem("lastSeenFavorites") || "0", 10) || 0;
      const lastNot =
        parseInt(localStorage.getItem("lastSeenNotifications") || "0", 10) || 0;

      setFavoritesNew(favCount > lastFav);
      setNotificationsNew(notCount > lastNot);
    } catch (e) {
      setFavoritesNew(false);
      setNotificationsNew(false);
    }
  };

  // refresh local favorites and notifications
  useEffect(() => {
    refreshLocalLists();
    const handler = () => refreshLocalLists();
    window.addEventListener("authChanged", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("authChanged", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // This for closing dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) {
        setActiveTopMenu("");
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setActiveTopMenu("");
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header ref={headerRef}>
      <div className="header-top">
        <div className="topbar-info">
          <address className="topbar-address">
            <div className="icon-phone">
              <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
              <span>1234 Elm Street, Springfield, USA</span>
            </div>
          </address>
          <div className="header-square"></div>
          <div className="header-contact item-time">
            <div className="icon">
              <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
            </div>
            <span>Daily : 8.00 am to 12.00 pm</span>
          </div>
        </div>
        <div className="topbar-info">
          <a href="tel:+15551234567" className="header-contact item-phone">
            <div className="icon">
              <ion-icon name="call-outline" aria-hidden="true"></ion-icon>
            </div>
            <span>+1 (555) 123-4567</span>
          </a>
          <div className="header-square"></div>
          <a
            href="mailto:info@casadeluna.com"
            className="header-contact item-email"
          >
            <div className="icon">
              <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            </div>
            <span>info@casadeluna.com</span>
          </a>
        </div>
      </div>
      <div className="header-container">
        {isPhoneMode ? (
          <>
            <Link to="/" className="logo" style={{ marginLeft: 8 }}>
              <img
                src={require("../assets/logo.png")}
                alt="Casa de Luna Logo"
                className="logo-"
              />
            </Link>
            {isLoggedIn ? (
              <>
                <div
                  className="mobile-top-icons"
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Link
                    to="/profile?section=notifications"
                    className="mobile-icon-btn"
                    aria-label="Notifications"
                    onClick={() => {
                      setActiveTopMenu("");
                      markNotificationsSeen();
                    }}
                  >
                    {notificationsNew && (
                      <div
                        className="dot notification-dot"
                        aria-hidden="true"
                        style={{
                          backgroundColor: "#1976d2",
                          position: "absolute",
                          top: 21,
                          right: 168,
                        }}
                      />
                    )}
                    <NotificationIcon />
                  </Link>

                  <Link
                    to="/profile?section=favorites"
                    className="mobile-icon-btn"
                    aria-label="Favorites"
                    onClick={() => {
                      setActiveTopMenu("");
                      markFavoritesSeen();
                    }}
                  >
                    {favoritesNew && (
                      <div
                        className="favorites-heart"
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          color: "#ff69b4",
                          fontSize: "0.8rem",
                          top: 12,
                          right: 120,
                          zIndex: 1000,
                        }}
                      >
                        ❤️
                      </div>
                    )}
                    <HeartIcon />
                  </Link>
                  <Link
                    to="/checkout"
                    className="mobile-icon-btn"
                    aria-label="Basket"
                  >
                    {((basket.items || []).length || 0) > 0 && (
                      <div
                        className="dot"
                        aria-hidden="true"
                        style={{ top: 20, right: 71 }}
                      />
                    )}
                    <BasketIcon />
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}
            <button
              type="button"
              className={`menu-icon ${isMenuOpen ? "open" : ""}`}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              <span className="hamburger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="logo">
              <img
                src={require("../assets/logo.png")}
                alt="Casa de Luna Logo"
                className="logo-"
              />
            </Link>

            <button
              type="button"
              className={`menu-icon ${isMenuOpen ? "open" : ""}`}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              <span className="hamburger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
            </button>
          </>
        )}

        {isMenuOpen && (
          <div
            className="menu-backdrop"
            role="button"
            tabIndex={0}
            aria-hidden="true"
            onClick={closeMenu}
            onKeyDown={(e) => e.key === "Escape" && closeMenu()}
          />
        )}

        <nav ref={navRef} className={isMenuOpen ? "nav-open" : ""}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMenu}
              >
                <span className="header-square nav-indicator"></span>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMenu}
              >
                <span className="header-square nav-indicator"></span>
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reservation"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMenu}
              >
                <span className="header-square nav-indicator"></span>
                Reservations
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/our-chefs"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMenu}
              >
                <span className="header-square nav-indicator"></span>
                Our Chefs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMenu}
              >
                <span className="header-square nav-indicator"></span>
                About Us
              </NavLink>
            </li>
            <li>
              {isPhoneMode ? (
                isLoggedIn ? (
                  <button
                    type="button"
                    className="mobile-icon-btn logout-mobile"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </button>
                ) : (
                  <Link to="/login" className="mobile-icon-btn login-mobile">
                    <LoginIcon />
                  </Link>
                )
              ) : (
                ""
              )}
            </li>
          </ul>
        </nav>

        {!isPhoneMode && (
          <div className="auth-links">
            {isLoggedIn ? (
              <div className="auth-logged-in-links">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeTopMenu === "notification"}
                  className="notification-link basket-link"
                  onClick={() => toggleTopMenu("notification")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleTopMenu("notification");
                  }}
                >
                  {notificationsNew && (
                    <div
                      className="dot notification-dot"
                      aria-hidden="true"
                      style={{
                        backgroundColor: "#1976d2",
                        position: "absolute",
                      }}
                    />
                  )}
                  <NotificationIcon
                    className={`notification-icon ${
                      activeTopMenu === "notification"
                        ? "opened-notification-dropdown"
                        : ""
                    }`}
                  />
                  {activeTopMenu === "notification" && (
                    <div className="topicon-dropdown-notification" role="menu">
                      <strong>Notifications</strong>
                      <div className="top-list fav">
                        {localNotifications.length === 0 ? (
                          <div className="dropdown-empty item-link">
                            No notifications
                          </div>
                        ) : (
                          localNotifications.slice(0, 6).map((n, i) => (
                            <div
                              key={i}
                              role="menuitem"
                              className="dropdown-item item-link"
                            >
                              {n.message || n}
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ marginTop: 8, textAlign: "right" }}>
                        <Link
                          to="/profile?section=notifications"
                          onClick={() => {
                            setActiveTopMenu("");
                            markNotificationsSeen();
                          }}
                          className="view-all-link-notify"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeTopMenu === "favorites"}
                  className="favorites-link basket-link"
                  onClick={() => toggleTopMenu("favorites")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleTopMenu("favorites");
                  }}
                >
                  {favoritesNew && (
                    <div
                      className="dot favorites-heart"
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        color: "#ff69b4",
                        fontSize: "0.8rem",
                      }}
                    >
                      ❤️
                    </div>
                  )}
                  <HeartIcon
                    className={`favorites-icon ${
                      activeTopMenu === "favorites"
                        ? "opened-favorites-dropdown"
                        : ""
                    }`}
                  />
                  {activeTopMenu === "favorites" && (
                    <div className="topicon-dropdown-favorites" role="menu">
                      <strong>Favorites</strong>
                      <div className="top-list">
                        {localFavorites.length === 0 ? (
                          <div className="dropdown-empty item-link">
                            No favorites yet
                          </div>
                        ) : (
                          localFavorites.slice(0, 6).map((f, i) => (
                            <div
                              key={i}
                              role="menuitem"
                              className="dropdown-item fav-item item-link"
                            >
                              <span style={{ marginRight: 8 }}>
                                {f.name || f.title || "Item"}
                              </span>
                              <small style={{ color: "#666" }}>
                                {f.price ? `$${f.price}` : ""}
                              </small>
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ marginTop: 8, textAlign: "right" }}>
                        <Link
                          to="/profile?section=favorites"
                          onClick={() => {
                            setActiveTopMenu("");
                            markFavoritesSeen();
                          }}
                          className="view-all-link-fav"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeTopMenu === "basket"}
                  className="basket-link"
                  onClick={() => toggleTopMenu("basket")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleTopMenu("basket");
                  }}
                >
                  <BasketIcon
                    className={`basket-icon ${
                      activeTopMenu === "basket" ? "opened-basket-dropdown" : ""
                    }`}
                  />
                  {((basket.items || []).length || 0) > 0 && (
                    <div className="dot" aria-hidden="true" />
                  )}
                  {activeTopMenu === "basket" && (
                    <div className="topicon-dropdown-basket" role="menu">
                      <strong>Basket</strong>
                      <div className="top-list">
                        {(basket.items || []).length === 0 ? (
                          <div className="dropdown-empty item-link">
                            Your basket is empty
                          </div>
                        ) : (
                          (basket.items || []).slice(0, 8).map((b, i) => (
                            <div
                              key={i}
                              role="menuitem"
                              className="dropdown-item basket-item item-link"
                            >
                              <span>
                                {b.dish?.name ||
                                  b.dish?.title ||
                                  b.name ||
                                  b.title}
                              </span>
                              <small style={{ float: "right" }}>
                                {b.quantity
                                  ? `x${b.quantity}`
                                  : b.qty
                                  ? `x${b.qty}`
                                  : ""}
                              </small>
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ marginTop: 8, textAlign: "right" }}>
                        <Link
                          to="/checkout"
                          onClick={() => setActiveTopMenu("")}
                          className="view-all-link-basket"
                        >
                          Secure your checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeTopMenu === "profile"}
                  className="profile-link btn-link"
                  style={{ display: "inline-block" }}
                  onClick={() => toggleTopMenu("profile")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleTopMenu("profile");
                  }}
                >
                  <ProfileIcon
                    className={`profile-icon ${
                      activeTopMenu === "profile"
                        ? "opened-profile-dropdown"
                        : ""
                    }`}
                  />
                  {activeTopMenu === "profile" && (
                    <div className="topicon-dropdown-profile">
                      <div className="view-profile-link item-link">
                        <Link
                          to="/profile"
                          onClick={() => setActiveTopMenu("")}
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="account-settings-link item-link">
                        <Link
                          to="/profile?section=settings"
                          onClick={() => {
                            setActiveTopMenu("");
                          }}
                        >
                          Account Settings
                        </Link>
                      </div>
                      <div className="logout-link item-link">
                        <div
                          className="btn-link logout-btn"
                          onClick={handleLogout}
                        >
                          Logout
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-link"
                style={{ display: "flex", alignItems: "center", marginTop: 16 }}
              >
                <LoginIcon />
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
