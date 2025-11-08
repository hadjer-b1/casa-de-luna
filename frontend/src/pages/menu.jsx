import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Utensils,
  Leaf,
  Soup,
  CakeSlice,
  Wine,
  UtensilsCrossed,
  Flame,
  ChefHat,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/Slices/userSlice";
import { sendToBasket } from "../redux/Slices/SendToBasket";
import { useToast } from "../components/Toast";
import HeartIcon from "@mui/icons-material/Favorite";
import shpe3 from "../assets/image/shape-3.png";
import shpe9 from "../assets/image/shape-9.png";
import shpe10 from "../assets/image/shape-10.png";
import "../styles/menu.css";

function Menu() {
  const dispatch = useDispatch();
  const [menuDishes, setMenuDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dishesPerPage] = useState(10);
  const [allDishes, setAllDishes] = useState([]);
  const location = useLocation();
  const userRole = useSelector((state) => state.user?.role || "");
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [selectorVisible, setSelectorVisible] = useState({});
  const toast = useToast();
  const [dish, setDish] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: 0,
    rating: 0,
    image: "",
  });

  // Log userRole for debugging
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("[Menu] userRole =", userRole);
    } catch (e) {}
  }, [userRole]);

  // Fetch user profile on mount to get role and other info
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Fetch menu dishes from backend
  useEffect(() => {
    const fetchMenuDishes = async () => {
      try {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/menu`);
        const data = await response.json();
        console.log(
          "[FETCH] Menu dishes from backend:",
          data.map((d) => ({ name: d.name, quantity: d.quantity }))
        );
        setMenuDishes(data);
        setAllDishes(data);
      } catch (error) {
        console.error("Error fetching menu dishes:", error);
      }
    };
    fetchMenuDishes();
  }, []);

  // adding a new dish to the menu 'backend and frontend'
  const handleAddDish = async (dish) => {
    try {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dish.name,
          price: parseFloat(dish.price),
          description: dish.description,
          category: dish.category,
          url: dish.url?.name || "default.jpg",
          rating: 0,
          country: "Unknown",
          quantity: dish.quantity,
        }),
      });

      if (response.ok) {
        const addedDish = await response.json();
        setMenuDishes((prevDishes) => [...prevDishes, addedDish]);
        setDish({
          name: "",
          price: "",
          description: "",
          category: "",
          quantity: 0,
          image: "",
          url: "",
        });
        if (dish.url) {
          const formData = new FormData();
          formData.append("image", dish.url);
          await fetch(`${process.env.REACT_APP_API_URL}/menu/${addedDish._id}/upload`, {
            method: "POST",
            body: formData,
          });
        }
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
      }
    } catch (error) {
      console.error("Error adding dish:", error.message);
    }
  };

  //function to remove a dish from the menu 'backend and frontend'
  const handleRemoveDish = async (dishToRemove) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/menu/${dishToRemove._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMenuDishes((prevDishes) =>
          prevDishes.filter((dish) => dish._id !== dishToRemove._id)
        );
      }
    } catch (error) {
      console.error("Error removing dish:", error);
    }
  };

  // function to fetch menu dishes
  const fetchMenuDishes = async () => {
    try {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/menu`);
      const data = await response.json();
      const normalized = data.map((d) => ({ ...d, quantity: d.quantity || 0 }));
      setMenuDishes(normalized);
    } catch (error) {
      console.error("Error fetching menu dishes:", error);
    }
  };

  //function to edit a dish in the menu 'backend and frontend'
  const handleEditMenuItem = async (dishToEdit) => {
    try {
      const formData = new FormData();
      formData.append("name", dishToEdit.name);
      formData.append("price", dishToEdit.price);
      formData.append("description", dishToEdit.description);
      formData.append("category", dishToEdit.category);
      formData.append("quantity", dishToEdit.quantity);
      formData.append("image", dishToEdit.url);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/menu/${dishToEdit._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedDish = await response.json();
        setMenuDishes((prevDishes) =>
          prevDishes.map((dish) =>
            dish._id === updatedDish._id ? updatedDish : dish
          )
        );
      }
    } catch (error) {
      console.error("Error editing menu item:", error);
    }
  };

  // the function to perform search (defensive: guard missing fields)
  const handleSearch = (event) => {
    const raw = event?.target?.value;
    const query = (typeof raw === "string" ? raw : "").trim().toLowerCase();
    if (!query) {
      fetchMenuDishes();
      return;
    }

    const filteredDishes = menuDishes.filter((dish) => {
      const name = (dish?.name || "").toString().toLowerCase();
      const desc = (dish?.description || "").toString().toLowerCase();
      const cat = (dish?.category || "").toString().toLowerCase();
      const country = (dish?.country || "").toString().toLowerCase();
      return (
        name.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        country.includes(query)
      );
    });
    setMenuDishes(filteredDishes);
  };

  //function to filter by category (memoized so effects can depend on it)
  const handleFilterByType = useCallback(
    (category) => {
      setCurrentPage(1);

      if (category === "all") {
        setMenuDishes(allDishes);
      } else {
        const filteredDishes = allDishes.filter(
          (dish) =>
            (dish.category || "").toString().toLowerCase() ===
            category.toLowerCase()
        );
        setMenuDishes(filteredDishes);
      }
    },
    [allDishes]
  );

  //pagination handler
  const handlePagination = (direction) => {
    const totalPages = Math.ceil(menuDishes.length / dishesPerPage);
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  //pagination calculations
  const totalPages = Math.ceil(menuDishes.length / dishesPerPage);
  const displayedDishes = menuDishes.slice(
    (currentPage - 1) * dishesPerPage,
    currentPage * dishesPerPage
  );

  // If the page was opened with a query like ?section=soups ... , it normalizes and applies the filter
  useEffect(() => {
    if (!allDishes || allDishes.length === 0) return;
    try {
      const params = new URLSearchParams(location.search || "");
      const raw = params.get("section") || params.get("type") || "";
      if (!raw) return;

      const normalize = (s) => {
        const v = String(s || "")
          .toLowerCase()
          .replace(/[-_]/g, " ")
          .trim();
        if (v === "soups") return "soup";
        if (v === "salads") return "salad";
        if (v === "desserts") return "dessert";
        if (v === "drinks") return "drink";
        if (v === "appetizers") return "appetizer";
        if (v === "main course" || v === "main" || v === "maincourse")
          return "main course";
        return v;
      };

      const normalized = normalize(raw);
      handleFilterByType(normalized);
    } catch (e) {
      // ignore URL parsing errors
    }
  }, [location.search, allDishes, handleFilterByType]);

  // Function to send notification to user and persist it
  const sendNotificationToUser = async (message, notifType = "info") => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const newNotif = {
        message,
        type: notifType,
        read: false,
        meta: { source: "system" },
        date: new Date().toISOString(),
      };
      stored.notifications = stored.notifications || [];
      stored.notifications.unshift(newNotif);
      localStorage.setItem("user", JSON.stringify(stored));

      window.dispatchEvent(new Event("authChanged"));

      const token = localStorage.getItem("token");
      if (!token) return;

  await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notifications: stored.notifications }),
      });

      toast.addToast(message, { type: notifType });
    } catch (err) {
      console.error("Failed to save notification:", err);
      toast.addToast(message, { type: notifType });
    }
  };

  // Increment order quantity
  const incrementOrderQty = (dishId) => {
    setSelectedQuantities((prev) => {
      const current = prev[dishId] || 1;
      return { ...prev, [dishId]: current + 1 };
    });
  };

  // Decrement order quantity
  const decrementOrderQty = (dishId) => {
    setSelectedQuantities((prev) => {
      const current = prev[dishId] || 1;
      if (current > 1) {
        return { ...prev, [dishId]: current - 1 };
      }
      return prev;
    });
  };

  // Update dish quantity on the server
  const updateDishQuantity = async (dishId, newQuantity) => {
    try {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/${dishId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        console.error("Failed to update quantity on server");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // this for localy storing
  const handleDisplayDish = (dishToDisplay) => {
    const newQuantity = Math.max(0, (dishToDisplay.quantity || 0) + 1);

    // toggle selector visibility: if currently visible hide it, otherwise show it
    setSelectorVisible((prev) => {
      const currently = !!prev[dishToDisplay._id];
      const next = !currently;
      // if we are showing the selector and there's no selected quantity, initialize to 1
      if (next) {
        setSelectedQuantities((sq) =>
          sq[dishToDisplay._id] ? sq : { ...sq, [dishToDisplay._id]: 1 }
        );
      }
      return { ...prev, [dishToDisplay._id]: next };
    });

    // still update local quantity and backend as before
    setMenuDishes((prev) =>
      prev.map((d) =>
        d._id === dishToDisplay._id
          ? { ...d, quantity: Math.max(0, (d.quantity || 0) + 1) }
          : d
      )
    );
    updateDishQuantity(dishToDisplay._id, newQuantity);
  };

  // this for backend sending
  const handleHideDish = (dishToHide) => {
    const newQuantity = Math.max(0, (dishToHide.quantity || 0) - 1);

    //locally update
    setMenuDishes((prev) => {
      const updated = prev.map((d) =>
        d._id === dishToHide._id
          ? { ...d, quantity: Math.max(0, (d.quantity || 0) - 1) }
          : d
      );
      // to the backend
      updateDishQuantity(dishToHide._id, newQuantity);

      if (newQuantity === 0) {
        setSelectedQuantities((sel) => {
          const copy = { ...sel };
          delete copy[dishToHide._id];
          return copy;
        });

        // notify admin that this dish is now out of stock
        if (userRole === "admin") {
          sendNotificationToUser(
            `${dishToHide.name || "This dish"} is now out of stock.`,
            "error"
          );
        }
        // hide the selector when item becomes out of stock
        setSelectorVisible((prev) => ({ ...prev, [dishToHide._id]: false }));
      }

      return updated;
    });
  };

  // Function to handle adding dish to basket
  const handleSendToBasket = (dish) => {
    const qty = selectedQuantities[dish._id] || 1;
    toast.addToast(`Added ${qty} x ${dish.name} to basket.`, { type: "info" });
    dispatch(sendToBasket(dish, qty));

    setMenuDishes((prev) =>
      prev.map((d) =>
        d._id === dish._id
          ? { ...d, quantity: Math.max(0, (d.quantity || 0) - qty) }
          : d
      )
    );

    // if resulting stock is 0, remove selector and optionally notify admin
    setSelectedQuantities((sel) => {
      const copy = { ...sel };
      const remaining = (dish.quantity || 0) - qty;
      if (remaining <= 0) {
        delete copy[dish._id];
        if (userRole === "admin") {
          sendNotificationToUser(
            `${dish.name || "This dish"} is now out of stock.`,
            "error"
          );
        }
      }
      return copy;
    });
  };

  // Function to toggle favorite status of a dish
  const toggleFavorite = (dishId) => {
    setMenuDishes((prevDishes) => {
      const updated = prevDishes.map((dish) => {
        if (dish._id === dishId) {
          const isFavorite = dish.isFavorite || false;
          return { ...dish, isFavorite: !isFavorite };
        }
        return dish;
      });

      const favs = updated.filter((d) => d.isFavorite).map((d) => d._id);

      const favsWithData = updated
        .filter((d) => d.isFavorite)
        .map((d) => ({
          _id: d._id,
          name: d.name,
          price: d.price,
          img: d.imageUrl,
        }));

      try {
        const existing = JSON.parse(localStorage.getItem("user") || "{}");
        const merged = { ...(existing || {}), favorites: favsWithData };
        localStorage.setItem("user", JSON.stringify(merged));
        window.dispatchEvent(new Event("authChanged"));
      } catch (e) {
        // ignore storage failures
      }

      (async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const res = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ favorites: favs }),
          });

          if (!res.ok) {
            let msg = `Failed to save favorites (${res.status})`;
            try {
              const data = await res.json();
              if (data && data.message) msg = data.message;
            } catch (e) {
              try {
                msg = await res.text();
              } catch (e2) {}
            }
            if (res.status === 401 || res.status === 403) {
              localStorage.removeItem("token");
              localStorage.removeItem("tokenExpiry");
              localStorage.removeItem("user");
              window.dispatchEvent(new Event("authChanged"));
              toast.addToast("Session expired. Please log in again.", {
                type: "error",
              });
              return;
            }
            toast.addToast(msg || "Could not save favorites to server.", {
              type: "error",
            });
          } else {
            try {
              const data = await res.json().catch(() => null);
              if (data && data.favorites) {
                const existing = JSON.parse(
                  localStorage.getItem("user") || "{}"
                );
                const merged = {
                  ...(existing || {}),
                  favorites: data.favorites,
                };
                localStorage.setItem("user", JSON.stringify(merged));
                window.dispatchEvent(new Event("authChanged"));
              }
            } catch (e) {}
            toast.addToast("Favorites saved.", { type: "info" });
          }
        } catch (err) {
          console.error("Favorite sync error:", err);
          toast.addToast("Network error while saving favorites.", {
            type: "error",
          });
        }
      })();

      return updated;
    });
  };

  return (
    <div className="menu">
      <div className="menu-header-menu">
        <h2>Our Special Selection</h2>
        <img src={shpe3} alt="Menu Header" className="menu-header-image-1" />
        <img src={shpe9} alt="Menu Header" className="menu-header-image-2" />
        <img src={shpe10} alt="Menu Header" className="menu-header-image-3" />
        <div className="Search">
          <input type="text" placeholder="Search..." onChange={handleSearch} />
          <button className="search-button">
            <Search />
          </button>
        </div>
        <div className="Type-icons">
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("all")}
          >
            <span className="IconMenu">
              <Utensils />
            </span>{" "}
            <p>All</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("salad")}
          >
            <span className="IconMenu">
              <Leaf />
            </span>{" "}
            <p>Salads</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("soup")}
          >
            <span className="IconMenu">
              <Soup />
            </span>{" "}
            <p>Soups</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("dessert")}
          >
            <span className="IconMenu">
              <CakeSlice />
            </span>{" "}
            <p>Desserts</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("drink")}
          >
            <span className="IconMenu">
              <Wine />
            </span>{" "}
            <p>Drinks</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("appetizer")}
          >
            <span className="IconMenu">
              <UtensilsCrossed />
            </span>{" "}
            <p>Appetizers</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("main course")}
          >
            <span className="IconMenu">
              <ChefHat />
            </span>{" "}
            <p>Main Course</p>
          </span>
          <span
            className="Type-icon flex items-center gap-1"
            onClick={() => handleFilterByType("spicy")}
          >
            <span className="IconMenu">
              <Flame />
            </span>{" "}
            <p>Spicy</p>
          </span>
        </div>
      </div>
      <div className="dish-list">
        {displayedDishes.map((dish) => (
          <div className="dish-item" key={dish._id}>
            <div className="dish">
              {dish.url && (
                <img src={dish.url} alt="Dish" className="dish-image" />
              )}
              <div className="dish-menu">
                <div className="dish-details">
                  <span className="dish--name">
                    <h3 className="dish-name">{dish.name}</h3>{" "}
                    <span className="dish-type">{dish.category}</span>
                  </span>
                  <p className="dish-description">{dish.description}</p>
                </div>
                <div className="dish-extras">
                  <span
                    className="dish-favorite"
                    onClick={() => toggleFavorite(dish._id)}
                  >
                    <div className="heart-icon-container">
                      {" "}
                      <HeartIcon
                        className={`favorite-icon ${
                          dish.isFavorite ? "active" : ""
                        }`}
                      />
                    </div>
                  </span>
                  <span className="dish-price">${dish.price}</span>
                </div>
              </div>
            </div>

            <div className="dish-actions">
              {userRole === "admin" && (
                <div className="admin-actions">
                  <button
                    className="add-to-menu"
                    onClick={() => handleDisplayDish(dish)}
                  >
                    Available
                  </button>
                  <button
                    className="remove-from-menu"
                    onClick={() => handleHideDish(dish)}
                  >
                    Out of Stock
                  </button>
                  <button
                    className="edit-menu-item"
                    onClick={() => handleEditMenuItem(dish)}
                  >
                    Change
                  </button>
                </div>
              )}
              {dish.quantity > 0 ? (
                selectorVisible[dish._id] ? (
                  <>
                    <div className="quantity-selector">
                      <button
                        className="qty-btn decrement"
                        onClick={() => decrementOrderQty(dish._id)}
                      >
                        -
                      </button>
                      <span className="qty-number">
                        {selectedQuantities[dish._id] || 1}
                      </span>
                      <button
                        className="qty-btn increment"
                        onClick={() => incrementOrderQty(dish._id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleSendToBasket(dish)}
                      className="add-to-cart"
                    >
                      Order
                    </button>
                  </>
                ) : (
                   <button
                    onClick={() => handleSendToBasket(dish)}
                    className="add-to-cart"
                  >
                    Order
                  </button>
                )
              ) : (
                <div className="out-of-stock-label">Out of stock</div>
              )}
            </div>
          </div>
        ))}

        {userRole === "admin" ? (
          <div className="admin-menu">
            <div className="add-admin-dish-form">
              <div className="dish-item">
                <div className="dish">
                  <div className="dish-image-url">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={dish.url}
                      onChange={(e) =>
                        setDish({ ...dish, url: e.target.value })
                      }
                      className="dish-input"
                    />{" "}
                    Or{" "}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setDish({ ...dish, image: e.target.files[0] })
                      }
                      className="dish-image"
                    />
                  </div>
                  <div className="dish-menu">
                    <div className="dish-details">
                      <select
                        value={dish.category}
                        onChange={(e) =>
                          setDish({ ...dish, category: e.target.value })
                        }
                        className="dish-input-select"
                      >
                        <option value="">Select Type</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="main">Main Course</option>
                        <option value="dessert">Dessert</option>
                        <option value="salad">Salad</option>
                        <option value="soup">Soup</option>
                        <option value="drink">Drink</option>
                        <option value="spicy">Spicy</option>
                      </select>

                      <div className="dish-price">
                        <input
                          type="text"
                          placeholder="Dish Price"
                          value={dish.price}
                          onChange={(e) =>
                            setDish({ ...dish, price: e.target.value })
                          }
                          className="dish-input"
                        />
                      </div>
                    </div>
                    <div className="dish-name">
                      <input
                        type="text"
                        placeholder="Dish Name"
                        value={dish.name}
                        onChange={(e) =>
                          setDish({ ...dish, name: e.target.value })
                        }
                        className="dish-input"
                      />
                    </div>
                    <div className="dish-description">
                      <input
                        type="text"
                        placeholder="Dish Description"
                        value={dish.description}
                        onChange={(e) =>
                          setDish({ ...dish, description: e.target.value })
                        }
                        className="dish-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="dish-actions">
                  <div className="admin-actions">
                    <button
                      className="add-to-menu"
                      onClick={() => handleAddDish(dish)}
                    >
                      Add
                    </button>
                    <button
                      className="remove-from-menu"
                      onClick={() => handleRemoveDish(dish.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="dish-pagination">
        <button
          className="prev-page"
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-number">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="next-page"
          onClick={() => handlePagination("next")}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default Menu;
