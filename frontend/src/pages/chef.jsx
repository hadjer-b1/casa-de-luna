import React from "react";
import "../styles/chef.css";
import { useEffect, useState } from "react";

const ChefPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [pickedDish, setPickedDish] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width:450px)").matches
      : false
  );
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartXRef = React.useRef(0);
  const lastDxRef = React.useRef(0);
  const isSwipingRef = React.useRef(false);

  // Fetch chefs data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/chefs")
      .then((response) => response.json())
      .then((data) => setChefs(data))
      .catch((error) => console.error("Error fetching chefs:", error));
  }, []);

  // when chefs load, init flipped/picked arrays
  useEffect(() => {
    if (chefs && chefs.length) {
      setFlipped(new Array(chefs.length).fill(false));
      setPickedDish(new Array(chefs.length).fill(null));
    }
  }, [chefs]);

  //  enable pagination
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width:450px)");
    const handler = (e) => {
      setIsSmallScreen(!!e.matches);
    };
    setIsSmallScreen(!!mq.matches);
    mq.addEventListener?.("change", handler);
    if (!mq.addEventListener) mq.addListener(handler);
    return () => {
      mq.removeEventListener?.("change", handler);
      if (!mq.removeEventListener) mq.removeListener(handler);
    };
  }, []);

  // reset page when breakpoint or chefs change
  useEffect(() => {
    setCurrentPage(0);
  }, [isSmallScreen, chefs.length]);

  // swipe handlers for mobile pagination
  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches.length) return;
    touchStartXRef.current = e.touches[0].clientX;
    lastDxRef.current = 0;
    isSwipingRef.current = false;
  };

  // track touch move to determine swipe
  const handleTouchMove = (e) => {
    if (!e.touches || !e.touches.length) return;
    const dx = e.touches[0].clientX - touchStartXRef.current;
    lastDxRef.current = dx;
    if (Math.abs(dx) > 10) isSwipingRef.current = true;
  };

  // handle touch end to trigger page change if swipe detected
  const handleTouchEnd = () => {
    const dx = lastDxRef.current || 0;
    const threshold = 50;  
    if (!isSwipingRef.current) return;
    if (dx < -threshold) {
      
      setCurrentPage((p) =>
        Math.min(
          p + 1,
          Math.max(
            0,
            Math.ceil(chefs.length / (isSmallScreen ? 3 : chefs.length)) - 1
          )
        )
      );
    } else if (dx > threshold) {
       setCurrentPage((p) => Math.max(0, p - 1));
    }
     isSwipingRef.current = false;
    lastDxRef.current = 0;
  };

  // Fetch menu items data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/menu")
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  // Handle click on a chef card to flip it and show a random dish
  const handleChefClick = (index) => {
     if (isSwipingRef.current) return;
    setPickedDish((prev) => {
      const next = [...prev];
      if (!next[index] && menuItems && menuItems.length) {
        const choice = menuItems[Math.floor(Math.random() * menuItems.length)];
        next[index] = choice;
      }
      return next;
    });

    // Only allow one flipped card at a time. If the clicked card is already
    // flipped, close it. Otherwise flip the clicked card and close others.
    setFlipped((prev) => {
      const isCurrentlyFlipped = !!prev[index];
      if (isCurrentlyFlipped) {
        // close it
        const next = prev.map(() => false);
        return next;
      }
      // open only this index
      const next = prev.map((_, i) => i === index);
      return next;
    });
  };

  // pagination calculations used by render
  const itemsPerPage = isSmallScreen ? 3 : chefs.length || 1;
  const totalPages = Math.max(1, Math.ceil(chefs.length / itemsPerPage));
  const page = Math.min(currentPage, Math.max(0, totalPages - 1));
  const start = page * itemsPerPage;
  const visible = chefs.slice(start, start + itemsPerPage);

  return (
    <div className="chef-container">
      <main className="chef-main">
        <h1 className="chef-title">Meet Our Chefs</h1>
        <p className="chef-description-1">
          Click on a chef to see their top choice dish!
        </p>
        <section
          className="chef-cards"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {chefs.length > 0 ? (
            visible.map((chef, relIdx) => {
              const idx = start + relIdx; 
              return (
                <div
                  className={`chef-card ${flipped[idx] ? "is-flipped" : ""}`}
                  key={chef.id || idx}
                  onClick={() => handleChefClick(idx)}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <img
                        src={
                          chef.imageUrl
                            ? chef.imageUrl.startsWith("http")
                              ? chef.imageUrl
                              : `/img/${chef.imageUrl}`
                            : chef.image_url || chef.img || chef.image || ""
                        }
                        alt={chef.name}
                        className="chef-photo"
                      />
                      <h2 className="chef-name">{chef.name}</h2>
                      <div className="chef-details">
                        <p className="chef-specialty">{chef.speciality}</p>
                        <p className="chef-country">{chef.country}</p>
                      </div>
                      <p className="chef-bio">{chef.description}</p>
                    </div>

                    <div className="card-back">
                      {pickedDish[idx] ? (
                        <>
                          <div className="favorite-label">Favorite dish</div>
                          <img
                            src={
                              pickedDish[idx].imageUrl
                                ? pickedDish[idx].imageUrl.startsWith("http")
                                  ? pickedDish[idx].imageUrl
                                  : `/img/${pickedDish[idx].imageUrl}`
                                : pickedDish[idx].url
                                ? pickedDish[idx].url.startsWith("http")
                                  ? pickedDish[idx].url
                                  : `/img/${pickedDish[idx].url}`
                                : pickedDish[idx].img ||
                                  pickedDish[idx].image ||
                                  ""
                            }
                            alt={pickedDish[idx].name}
                            className="dish-photo"
                          />
                          <h3 className="dish-name">{pickedDish[idx].name}</h3>
                        </>
                      ) : (
                        <p className="no-dish">No dish available</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No chefs available</p>
          )}
        </section>

         {isSmallScreen && totalPages > 1 && (
          <div className="chef-pagination">
            <button
              className="chef-page-btn"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Prev
            </button>
            <div className="chef-page-indicator">
              Page {page + 1} / {totalPages}
            </div>
            <button
              className="chef-page-btn"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page === totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefPage;
