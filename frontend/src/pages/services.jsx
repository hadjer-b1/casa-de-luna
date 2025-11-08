import { useState, useEffect } from "react";
import "../styles/services.css";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";  
import StarIcon from "@mui/icons-material/Star";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import SpaIcon from "@mui/icons-material/Spa";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EventIcon from "@mui/icons-material/Event";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import PeopleIcon from "@mui/icons-material/People";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useParams } from "react-router-dom";

function Services() {
  const [currentService, setCurrentService] = useState(null);
  const { service } = useParams();

  useEffect(() => {
    setCurrentService(service);
  }, [service]);

  return (
    <div className="services-container">
      {currentService === "catering" && (
        <Box className="catering-page">
          <Typography variant="h4" className="catering-title">
            Catering Service
          </Typography>
          <div className="catering-intro section-service">
            <img
              src="https://media.istockphoto.com/id/1466942373/photo/close-up-shot-of-a-tasty-professional-catering-assortment-placed-on-trays.jpg?s=612x612&w=0&k=20&c=9M869DlQ3faE0kK-f83IvlXAONvONZTF2zxEgy3kdG4="
              alt="Catering Service"
              className="catering-image"
            />
            <div className="catering-text">
              <Typography variant="body1" className="catering-paragraph">
                Indulge your guests with a culinary experience that speaks of
                taste, elegance, and effortless hospitality. Our Catering
                Service is designed to transform every event into a refined
                celebration of flavor and style.
              </Typography>

              <Typography variant="body1" className="catering-paragraph">
                Whether you're planning a private dinner, a corporate luncheon,
                a wedding reception, or a festive gathering, we curate bespoke
                menus that reflect your vision and our culinary mastery. Our
                chefs combine seasonal ingredients, innovative techniques, and
                timeless classics to create dishes that not only satisfy the
                palate but leave a lasting impression.
              </Typography>

              <Typography variant="body1" className="catering-paragraph">
                From beautifully arranged canapés to full-course plated meals,
                our service is both seamless and gracious. Our team handles
                every detail—from presentation to timing—so you can focus on
                your guests while we bring the charm.
              </Typography>
            </div>
          </div>
          <Typography variant="h6" className="catering-subtitle">
            What We Offer
          </Typography>

          <List className="catering-list service-list">
            <ListItem>
              <ListItemIcon>
                <AutoAwesomeIcon />
              </ListItemIcon>
              <ListItemText primary="Customized menus tailored to your event style and dietary needs" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText primary="Elegant buffet or plated meal options" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmojiPeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Professional chefs and hospitality staff" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SpaIcon />
              </ListItemIcon>
              <ListItemText primary="Fresh, locally sourced ingredients" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HomeWorkIcon />
              </ListItemIcon>
              <ListItemText primary="Setup, service, and cleanup included" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Attention to detail and exceptional presentation" />
            </ListItem>
          </List>

          <Typography
            variant="body1"
            className="catering-paragraph .service-paragraph"
          >
            With a touch of refinement and an eye for detail, we create more
            than meals—we craft experiences. Let us make your next event
            unforgettable.
          </Typography>

          <Typography variant="body1" className="catering-cta">
            <strong>
              Get in touch with us to begin planning your menu today.
            </strong>
          </Typography>
        </Box>
      )}
      {currentService === "events" && (
        <Box className="event-page">
          <Typography variant="h4" className="event-title">
            Event Service
          </Typography>

          <div className="catering-intro section-service">
            <img
              src="https://media.istockphoto.com/id/1191311267/photo/tables-17.jpg?s=612x612&w=0&k=20&c=SgD4geUihjpB-AeD4PiSZMUepUhQJfImHD7YAR--rhQ="
              alt="Catering Service"
              className="catering-image"
            />
            <div className="event-text">
              <Typography
                variant="body1"
                className="event-paragraph .service-paragraph"
              >
                Every moment deserves to be celebrated in style. Our Event
                Service turns your vision into a captivating reality— with
                elegance, precision, and creativity at the core of every detail.
              </Typography>

              <Typography
                variant="body1"
                className="event-paragraph .service-paragraph"
              >
                Whether you're planning a corporate gala, a milestone birthday,
                a cultural celebration, or a refined private gathering, we
                tailor each experience to reflect your personality and purpose.
                With a team of passionate planners and a network of trusted
                vendors, we manage every element—from concept to curtain call.
              </Typography>

              <Typography
                variant="body1"
                className="event-paragraph .service-paragraph centered"
              >
                Our goal is to create events that resonate emotionally,
                visually, and experientially—leaving lasting impressions for
                both hosts and guests.
              </Typography>
            </div>
          </div>
          <Typography variant="h6" className=".service-subtitle">
            Our Services Include
          </Typography>

          <List className="event-list service-list">
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Full event planning and coordination" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DesignServicesIcon />
              </ListItemIcon>
              <ListItemText primary="Custom event theme & design" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Guest management and RSVP tracking" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Entertainment, sound & lighting coordination" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>
              <ListItemText primary="Décor, floral arrangements & venue styling" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Vendor sourcing and management" />
            </ListItem>
          </List>

          <Typography
            variant="body1"
            className="event-paragraph .service-paragraph centered"
          >
            From intimate gatherings to grand celebrations, we blend creativity
            with organization to craft moments that matter. Let us bring your
            next event to life—with distinction and charm.
          </Typography>

          <Typography variant="body1" className="event-cta service-cta">
            <strong>Contact us today and let the planning begin.</strong>
          </Typography>
        </Box>
      )}
      {currentService === "delivery" && (
        <Box className="delivery-page">
          <Typography variant="h4" className="delivery-title">
            Delivery Service
          </Typography>

          <div className="catering-intro section-service">
            <img
              src="https://media.istockphoto.com/id/1320208118/photo/close-up-of-woman-packing-food-for-delivery.jpg?s=612x612&w=0&k=20&c=ND8KN6zpoGGaWoZOj_wlTmExfhrNioLchEgMmj0KOr4="
              alt="Catering Service"
              className="catering-image"
            />
            <div className="event-text">
              <Typography variant="body1" className="delivery-paragraph">
                Experience reliability and elegance at your doorstep. Our
                Delivery Service is built on punctuality, care, and
                excellence—ensuring your orders arrive fresh, secure, and right
                on time.
              </Typography>

              <Typography variant="body1" className="delivery-paragraph">
                Whether you're ordering a gourmet meal, a curated gift package,
                or event supplies, we treat every delivery as a promise kept.
                Our professional team handles every package with precision, from
                preparation to final handoff.
              </Typography>

              <Typography variant="body1" className="delivery-paragraph">
                We serve individuals, businesses, and events with delivery
                solutions tailored to their unique needs, offering both same-day
                and scheduled services with real-time tracking and dedicated
                support.
              </Typography>
            </div>
          </div>
          <Typography variant="h6" className=".service-subtitle">
            Our Delivery Includes
          </Typography>

          <List className="delivery-list service-list">
            <ListItem>
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="Fast and reliable delivery service" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Scheduled or express delivery options" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Secure handling and tamper-proof packaging" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrackChangesIcon />
              </ListItemIcon>
              <ListItemText primary="Real-time tracking and updates" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupportAgentIcon />
              </ListItemIcon>
              <ListItemText primary="Responsive support for inquiries or changes" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Professional and courteous delivery personnel" />
            </ListItem>
          </List>

          <Typography
            variant="body1"
            className="delivery-paragraph .service-paragraph"
          >
            With our service, convenience meets confidence. Wherever you are, we
            ensure your order arrives in perfect condition— every time.
          </Typography>

          <Typography variant="body1" className="delivery-cta service-cta">
            <strong>
              Place your order today and enjoy seamless delivery tailored to
              your needs.
            </strong>
          </Typography>
        </Box>
      )}
      {currentService === "specials" && (
        <Box className="special-page">
          <Typography variant="h4" className="special-title">
            Special Services
          </Typography>
          <div className="catering-intro section-service">
            <img
              src="https://media.istockphoto.com/id/1075337052/photo/luxury-five-stars-hotel-restaurant.jpg?s=612x612&w=0&k=20&c=3Zl2rHkChxyBFMB4wWcg-91S4wItPtcUaYMzJ7OKsM0="
              alt="Catering Service"
              className="catering-image"
            />
            <div className="event-text">
              <Typography
                variant="body1"
                className="special-paragraph .service-paragraph"
              >
                For moments that demand more than ordinary, we offer Special
                Services tailored to your most refined expectations. These
                services are crafted with precision, discretion, and a deep
                understanding of personalized experiences.
              </Typography>

              <Typography
                variant="body1"
                className="special-paragraph .service-paragraph"
              >
                From private culinary experiences to high-end concierge
                arrangements, our Special Services are designed to fulfill
                unique requests with grace and professionalism. Whether it’s a
                one-of-a-kind event or an elite guest’s requirement, we are here
                to bring your vision to life—elegantly and effortlessly.
              </Typography>

              <Typography variant="body1" className="special-paragraph">
                This is where exclusivity meets artistry. Every detail is
                curated to reflect your taste, values, and purpose.
              </Typography>
            </div>
          </div>
          <Typography variant="h6" className=".service-subtitle">
            What We Offer
          </Typography>

          <List className="special-list service-list">
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="VIP guest handling and red-carpet experiences" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VolunteerActivismIcon />
              </ListItemIcon>
              <ListItemText primary="Private chef & in-home dining experiences" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SettingsSuggestIcon />
              </ListItemIcon>
              <ListItemText primary="Fully customizable event setups & themes" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WorkspacePremiumIcon />
              </ListItemIcon>
              <ListItemText primary="High-touch luxury services & premium requests" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LightbulbIcon />
              </ListItemIcon>
              <ListItemText primary="Creative consulting for unique and visionary ideas" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AutoAwesomeIcon />
              </ListItemIcon>
              <ListItemText primary="Exclusive access to elite vendors and experiences" />
            </ListItem>
          </List>

          <Typography
            variant="body1"
            className="special-paragraph .service-paragraph centered"
          >
            Our Special Services are limited in availability and defined by
            distinction. We invite you to inquire about bespoke experiences that
            reflect your individuality and exceed expectation.
          </Typography>

          <Typography variant="body1" className="special-cta service-cta">
            <strong>
              Contact us to explore how we can craft something truly
              exceptional, just for you.
            </strong>
          </Typography>
        </Box>
      )}
    </div>
  );
}
export default Services;
