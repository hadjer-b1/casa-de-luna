import React from "react";
import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";
import usePhotoMinimize from "../hooks/usePhotoMinimize";

import separator from "../assets/image/separator.svg";
import shapeOne from "../assets/image/shape-1.png";
import shapeTwo from "../assets/image/shape-5.png";
import shapeThree from "../assets/image/shape-3.png";
import shapeFour from "../assets/image/shape-7.png";
import shapeFive from "../assets/image/shape-3.png";
import TableImage from "../assets/image/fancy-table.png";
import SustainableIcon from "../assets/Vectors/sustainable-green-svgrepo-com.svg";
import CraftsmanshipIcon from "../assets/Vectors/craft.png";
import FreshIcon from "../assets/Vectors/fresh.png";
import CommunityIcon from "../assets/Vectors/people.png";
import "../styles/aboutUs.css";
import "../styles/home.css";

export default function AboutUs() {
  useScrollReveal(".reveal", { threshold: 0.1 });
  usePhotoMinimize(".team-card", { threshold: 0.5, maxWidth: 768 });

  return (
    <main className="about-page">
      <section className="hero">
        <div className="hero-inner">
          <h1>About Our Restaurant</h1>
          <img alt="separator" src={separator} className="separator-img" />

          <p className="tagline">
            Handcrafted dishes · Seasonal ingredients · Warm hospitality
          </p>
          <div className="actions">
            <div>
              <Link to="/menu" className="btn primary">
                View Menu
              </Link>
            </div>
            <div>
              <Link to="/reservation" className="btn outline">
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="story">
        <img alt="Story background" src={shapeOne} className="shape-one" />
        <div className="container">
          <h2 className="story-title reveal">Our Story</h2>
          <p className="reveal">
            Founded in 2025 by the shore, we set out to create a place where
            fine dining meets the calm of the sea. Our chefs craft each dish
            with local, seasonal ingredients, letting coastal flavors shine
            through every detail. Here, golden light, gentle waves, and refined
            taste come together, turning every meal into a moment worth
            remembering.
          </p>

          <div className="timeline">
            <div className="item">
              <strong className="reveal">2025</strong>
              <span className="reveal">
                Opened our seaside doors — blending fine dining with coastal
                serenity.
              </span>
            </div>
            <div className="item">
              <strong className="reveal">2026</strong>
              <span className="reveal">
                Introduced our signature ocean-inspired tasting menu and live
                sunset dinners.
              </span>
            </div>
            <div className="item">
              <strong className="reveal">2027</strong>
              <span className="reveal">
                Partnered with local fishermen and farmers to celebrate
                sustainable cuisine.
              </span>
            </div>
          </div>
        </div>
        <img alt="Story background" src={shapeTwo} className="shape-two" />
      </section>

      <section className="location-cta">
        <div className="container location-container">
          <h2 className="reveal">Experience Coastal Elegance</h2>
          <p className="reveal">
            Join us by the sea for an unforgettable dining experience.
          </p>
          <div className="btn primary btn-reservation">
            <img
              alt="Coastal dining"
              src={TableImage}
              className="table-image"
            />
            <Link to="/reservation">Book Your Table</Link>
          </div>
          <p className="small">
            Check the <Link to="/location">restaurant's location</Link>
          </p>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <img
            alt="Story background"
            src={shapeThree}
            className="shape-three"
          />
          <h2 className="reveal" style={{ zIndex: 1000 }}>
            Meet the Team
          </h2>
          <div className="cards">
            <article className="card team-card photo-minimize reveal">
              <img
                alt="CEO"
                src="https://media.istockphoto.com/id/1450788989/photo/portrait-of-happy-african-businesswoman-holding-digital-tablet-in-the-office.jpg?s=612x612&w=0&k=20&c=aalIPdiN9iTx45CkGrGMlGn-LVyICKzNvgoARsyAArg="
              />
              <h3>Gigi Lotusia</h3>
              <span>CEO & Founder</span> <p> vision and leadership.</p>
            </article>

            <article className="card team-card photo-minimize reveal">
              <img
                alt="Head chef"
                src=" https://media.istockphoto.com/id/1394055240/photo/happy-black-female-chef-preparing-food-in-frying-pan-at-restaurant-kitchen.jpg?s=612x612&w=0&k=20&c=6DjpoYqgYVDLmtj3-q7H7wvoiwkVgzi1rn7a_XUZ_Ng="
              />
              <h3>Chef Ana Ruiz</h3>
              <span>Executive Chef & Co-founder</span>
              <p> seasonal menus and bold flavors.</p>
            </article>

            <article className="card team-card photo-minimize reveal">
              <img
                alt="Pastry chef"
                src="https://media.istockphoto.com/id/1634442518/photo/happy-baker-in-uniform-at-door-of-his-cafe.jpg?s=612x612&w=0&k=20&c=2FXiZhChBSgwy6IlBbh-ZMygutkU4sCFNpUwBwjMHZY="
              />
              <h3>Sam Patel</h3>
              <span>Pastry Chef</span>
              <p> desserts inspired by classic techniques.</p>
            </article>

            <article className="card team-card photo-minimize reveal">
              <img
                alt="General manager"
                src="https://media.istockphoto.com/id/1197490713/photo/serious-confident-businessman.jpg?s=612x612&w=0&k=20&c=omxI9vGGzC_V7GnSuPI4m0knhwxX8mDUbptgm6EA_ro="
              />
              <h3>Lena Ortiz</h3>
              <span>General Manager</span>
              <p> hospitality and guest experience.</p>
            </article>
          </div>
        </div>
        <img alt="Story background" src={shapeFive} className="shape-five" />
        <img alt="Story background" src={shapeFour} className="shape-four" />
        <img alt="Story background" src={shapeFive} className="shape-six" />
      </section>

      <section className="values">
        <div className="container">
          <h2 className="reveal" style={{ zIndex: 1000 }}>
            Our Values
          </h2>
          <ul className="values-list">
            <li>
              <div className="icon-wrapper">
                <img
                  alt="Sustainability Icon"
                  src={SustainableIcon}
                  className="value-icon"
                />
              </div>
              <strong className="value">Sustainability</strong>
              <p>sourcing from local producers.</p>
            </li>
            <li>
              <div className="icon-wrapper">
                <img
                  alt="Craftsmanship Icon"
                  src={CraftsmanshipIcon}
                  className="value-icon"
                />
              </div>
              <strong className="value">Craftsmanship</strong>
              <p> made-from-scratch, with care.</p>
            </li>
            <li>
              <div className="icon-wrapper">
                <img
                  alt="Freshness Icon"
                  src={FreshIcon}
                  className="value-icon"
                />
              </div>
              <strong className="value">Freshness</strong>
              <p> using the finest ingredients.</p>
            </li>
            <li>
              <div className="icon-wrapper">
                <img
                  alt="Community Icon"
                  src={CommunityIcon}
                  className="value-icon"
                />
              </div>
              <strong className="value">Community</strong>
              <p>giving back through events and partnerships.</p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
