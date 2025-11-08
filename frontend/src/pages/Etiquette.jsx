import React from "react";
import "../styles/etiquette.css";

const Etiquette = () => {
  return (
    <div className="etiquette-container">
      <main className="etiquette-main">
        <h1 className="etiquette-title">Restaurant Etiquette</h1>
        <section className="etiquette-content">
          <h3>
            For our Dear Customers desiring to learn about Table Etiquette,
            allow us to share with you a course on the essentials of dining
            etiquette.
          </h3>
          <ul>
            <li>
              <strong>Table Manners:</strong> Use polite language, keep elbows
              off the table, and avoid talking with your mouth full.
            </li>
            <li>
              <strong>Table Setting:</strong> Familiarize yourself with the
              layout of utensils and glassware.
            </li>
            <li>
              <strong>Dining Etiquette:</strong> Practice proper etiquette, such
              as waiting for everyone to be served before eating.
            </li>
            <li>
              <strong>Utensil Use:</strong> you can check the video below that
              shows the proper use of utensils.
            </li>
          </ul>
          <div className="note">
            <p>
              If you wanna learn proper etiquette, you can always reach to us to
              provide you with personal coaching training. you can email us in
              the contact section.
            </p>
          </div>
          <h2>Recommended Videos</h2>
          <div className="etiquette-videos">
            <div className="video-wrapper">
              <iframe
                width="360"
                height="315"
                src="https://www.youtube-nocookie.com/embed/jv_y-DQGGEQ?si=sUX6YfyGp1lxF1-h&amp;start=5"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              <p>Restaurant Etiquette 101</p>
            </div>
            <div className="video-wrapper">
              <iframe
                width="360"
                height="315"
                src="https://www.youtube-nocookie.com/embed/6k3nTXy34ec?si=x_WPnhGdL6SUDObP&amp;start=5"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              <p>Fine Dining Etiquette</p>
            </div>
            <h2>Essential Restaurant Etiquette Tips</h2>
            <ul>
              <li>
                <strong>Dress Code:</strong> Respectfully we ask you to feel
                free to dress casually but avoid overly inappropriate attire. In
                some occasions, we may have specific dress codes in place.
              </li>
              <li>
                <strong>Punctuality:</strong> We kindly ask your grace in
                arriving on time for your reservation.
              </li>
              <li>
                <strong>Respect:</strong> We value your valuable experience and
                we do so for our honorable customers, so we appreciate your
                understanding and cooperation.
              </li>

              <li>
                <strong>Ordering:</strong> Kindly we ask you to be clear and
                respectful when ordering. Ask questions if unsure about menu
                items.
              </li>
              <li>
                <strong>Mobile Devices:</strong> Silence your phone and avoid
                using it at the table.
              </li>
              <li>
                <strong>Noise Level:</strong> Keep conversations at a
                comfortable volume.
              </li>
              <li>
                <strong>Children:</strong> Supervise children and ensure they
                are respectful of others.
              </li>

              <li>
                <strong>Payment:</strong> Be prepared to pay promptly and tips
                aren't allowed so please be mindful of this policy.
              </li>
            </ul>
          </div>
          <h2>Quick Tips</h2>
          <ul>
            <li>Wait for everyone to be served before eating.</li>
            <li>Place your napkin on your lap as soon as you sit down.</li>
            <li>Say "please" and "thank you" often.</li>
            <li>Ask before taking photos in the restaurant.</li>
            <li>Let the server know about any dietary restrictions.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Etiquette;
