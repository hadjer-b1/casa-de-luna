import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Lamp,
  Camera,
  ArrowLeft,
  ArrowRight,
  PlusIcon,
  BeanOffIcon,
} from "lucide-react";
import {
  Utensils,
  Leaf,
  Soup,
  CakeSlice,
  Wine,
  UtensilsCrossed,
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sendToBasket } from "../redux/Slices/SendToBasket";
import { useToast } from "../components/Toast";
import separator from "../assets/image/separator.svg";
import "../styles/home.css";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [chefs, setChefs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  /* fetching the meals from the db*/
  useEffect(() => {
    fetch("http://localhost:5000/menu")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setMeals(Array.isArray(data) ? data : data.menu || []);
      })
      .catch((err) => console.error("Error fetching meals:", err));
  }, []);

  // Fetching chefs
  useEffect(() => {
    fetch("http://localhost:5000/chefs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched chefs:", data);
        setChefs(Array.isArray(data) ? data : data.chefs || []);
      })
      .catch((err) => console.error("Error fetching chefs:", err));
  }, []);

  // function to make the arrows functional
  const handleArrowClick = (direction) => {
    const container = document.querySelector(".menu-moving-item");
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // function to make the icons in the menu functional
  const handleIconClick = (type) => {
    const filteredMeals = meals.filter((meal) => meal.type === type);
    setMeals(filteredMeals);
    navigate(`/menu?type=${type}`);
  };
  return (
    <div className="main">
      <section className="hero">
        <div className="hero-content">
          <h2 className="subtitle">A Taste of Shadows</h2>
          <img src={separator} alt="Separator" className="separator" />
          <p className="description">
            Venture forth into a realm where the light dares not linger, and
            every flavor whispers of intrigue.
            <span className="description-2">
              We bid you welcome to an experience draped in refinement and
              enigma.
            </span>
          </p>
          <Link to="/menu" className="menu-link-btn">
            <span className="btn-text text-1">Explore the Menu</span>
            <span className="btn-text text-2">Explore the Menu</span>
          </Link>
        </div>{" "}
        <Link to="/reservation" className="booking-btn has-after">
          <img
            src={require("../assets/image/fancy-table.png")}
            alt="Dark Restaurant"
            className="fancy-table"
          />
          <span className="text span label-2 text-center">Book Your Table</span>
        </Link>
      </section>

      <section className="content-intro">
        <div className="features">
          <div className="feature">
            <ChefHat className="feature-icon" />
            <div className="feature-info">
              <h3 className="feature-title">Exquisite Flavors</h3>
              <p className="feature-description">
                Discover a curated selection of dishes that tantalize the
                senses.
              </p>
            </div>
          </div>
          <div className="feature">
            <Lamp className="feature-icon" />
            <div className="feature-info">
              <h3 className="feature-title">Elegant Atmosphere</h3>
              <p className="feature-description">
                Immerse yourself in an ambiance that speaks of sophistication
                and mystery.
              </p>
            </div>
          </div>
          <div className="feature">
            <Camera className="feature-icon" />
            <div className="feature-info">
              <h3 className="feature-title">Unforgettable Experiences</h3>
              <p className="feature-description">
                Create lasting memories with every visit, as we redefine dining.
              </p>
            </div>
          </div>
          <div className="feature">
            <BeanOffIcon className="feature-icon bean" />
            <div className="feature-info">
              <h3 className="feature-title">Allergies</h3>
              <p className="feature-description">
                We take allergies seriously. Our menu is crafted to accommodate
                various dietary needs, ensuring a safe dining experience for
                all.
              </p>
            </div>
          </div>
        </div>
        <div className="our-menu-top">
          <div className="menu-header-top">
            <h2 className="menu-title">Browse Our Menu </h2>
            <div className="arrow">
              <span
                className="arrow-left"
                onClick={() => handleArrowClick("left")}
              >
                <ArrowLeft />
              </span>
              <span
                className="arrow-right"
                onClick={() => handleArrowClick("right")}
              >
                <ArrowRight />
              </span>
            </div>
          </div>
          <div className="menu-moving-item">
            {/*Displaying the meals cards*/}

            {meals.map((meal) => (
              <div key={meal._id || meal.id} className="item-card-top">
                <div className="item-header">
                  <img src={meal.url} alt={meal.name} className="item-image" />
                  <div className="item-details-top">
                    <h3 className="item-name-top">{meal.name}</h3>
                    <p className="item-description">{meal.description}</p>
                  </div>
                </div>
                <div className="item-price">
                  <div className="item-pricing">
                    <span className="item-price-label">Regular Price:</span>
                    <span className="item-price-value">${meal.price}</span>
                  </div>
                  <button
                    className="item-button"
                    onClick={() => {
                      // add one of this meal to the basket
                      const qty = 1;
                      toast.addToast(`Added ${qty} x ${meal.name} to basket.`, {
                        type: "info",
                      });
                      dispatch(sendToBasket(meal, qty));
                    }}
                  >
                    <PlusIcon className="plus-icon" />
                  </button>
                </div>
              </div>
            ))}

            <div className="item-card-top">
              <div className="item-header">
                <img
                  src={require("../assets/image/bg.jpg")}
                  alt="Dish 1"
                  className="item-image"
                />
                <div className="item-details-top">
                  <h3 className="item-name-top">Mystic Mushroom</h3>
                  <p className="item-description">Delicious and creamy</p>
                </div>
              </div>
              <div className="item-price">
                <div className="item-pricing">
                  <span className="item-price-label">Regular Price:</span>
                  <span className="item-price-value">$180</span>
                </div>
                <button className="item-button">
                  <PlusIcon className="plus-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chef-section">
        <h2 className="chef-section-title">Our Royale Chef</h2>
        <div className="chef-cards-container">
          {/*instead of displaying all the chefs display only first 4 chefs*/}
          {chefs.length > 0 ? (
            chefs.slice(0, 4).map((chef, index) => (
              <div
                key={chef._id || chef.id || index}
                className="chef-card-home"
              >
                <div className="chef-image-div">
                  <img
                    src={
                      chef.imageUrl
                        ? chef.imageUrl.startsWith("http")
                          ? chef.imageUrl
                          : `/img/${chef.imageUrl}`
                        : chef.image_url || chef.img || chef.image || ""
                    }
                    alt={chef.name}
                    className="chef-img"
                  />
                </div>
                <div className="chef-info">
                  <h3 className="chef-name">{chef.name}</h3>
                  <span className="Type-label">{chef.Specialty}</span>
                </div>
              </div>
            ))
          ) : (
            <p>Loading chefs...</p>
          )}
        </div>
      </section>
      <div className="menu-header">
        <h2 className="menu-title"> Our Menu</h2>
        <div className="Type-icons">
          <Link className="Type-icon flex items-center gap-1" to="/menu">
            <Utensils className="IconMenu" />
            <span className="Type-label">All</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            to="/menu?section=salads"
          >
            <Leaf className="IconMenu" />
            <span className="Type-label">Salads</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("soups")}
            to="/menu?section=soups"
          >
            <Soup className="IconMenu" />
            <span className="Type-label">Soups</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("desserts")}
            to="/menu?section=desserts"
          >
            <CakeSlice className="IconMenu" />
            <span className="Type-label">Desserts</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("drinks")}
            to="/menu?section=drinks"
          >
            <Wine className="IconMenu" />
            <span className="Type-label">Drinks</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("appetizers")}
            to="/menu?section=appetizers"
          >
            <UtensilsCrossed className="IconMenu" />
            <span className="Type-label">Appetizers</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("main_course")}
            to="/menu?section=main_course"
          >
            <ChefHat className="IconMenu" />
            <span className="Type-label">Main Course</span>
          </Link>
          <Link
            className="Type-icon flex items-center gap-1"
            onClick={() => handleIconClick("spicy")}
            to="/menu?section=spicy"
          >
            <Flame className="IconMenu" />
            <span className="Type-label">Spicy</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;
