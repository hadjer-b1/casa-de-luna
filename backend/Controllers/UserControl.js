const Users = require("../Models/UsersModel");
const sendEmail = require("../services/emailService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.addNewUser = async (req, res) => {
  try {
    const { fullname, email, username, password, role, phone } = req.body;
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Your honor already exists, please log in instead." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    usernameTaken = await Users.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({
        message: "Username already taken, please try something else.",
      });
    }
    if (username.length < 3 || fullname.length < 3) {
      return res.status(400).json({
        message: "Username and fullname must be at least 3 characters long.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      fullname,
      email,
      username,
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res
      .status(201)
      .json({ message: "Your account has been created successfully!", token });
    const Html = `
    <div style="font-family: 'Georgia', serif; padding: 40px; border: 1px solid #e4dcd3; border-radius: 12px; background: linear-gradient(135deg, #fdfcfb, #e2d1c3); max-width: 620px; margin: auto; box-shadow: 0 8px 16px rgba(0,0,0,0.05);">

     <div style="text-align: left; margin-bottom: 20px; display: flex; ">
    <img src="https://static.vecteezy.com/system/resources/previews/023/629/523/original/black-crescent-moon-ornament-on-transparent-background-free-png.png" alt="Casa De Luna Logo" style="width: 80px; height: auto;">
    <h1 style="font-family: serif; color: #6b4c3b; font-size: 20px; margin-top: 20px;">Casa De Luna</h1>
    </div>

  <p style="font-size: 20px; font-weight: bold; color: #3b3b3b;">Dearest ${savedUser.fullname},</p>

    <p style="font-family: 'Georgia', serif; font-size: 16px; color: #333;">
    Welcome to <strong>Casa De Luna</strong> — where every meal is a celebration of flavor and every guest is part of our cherished community.<br><br>
    Your account has been successfully created, and we’re delighted to have you at our table.<br><br>
    <em>Here’s to delightful moments and unforgettable tastes.</em>
    <p>Have a marvelous meal!</p>
</p>

<p style="font-size: 16px; color: #5c5c5c;">
  Thank you for joining us — we can’t wait to delight your taste with everything our menu has to offer.<br>
  <em>May every visit be rich with flavor and warm with connection.</em>
</p>


  <p style="margin-top: 50px; font-size: 16px; color: #3b3b3b;">
    Warmest regards,<br/>
    <span style="font-style: italic;">The Casa De Luna Team</span>
  </p>
</div>

`;

    await sendEmail({
      to: savedUser.email,
      subject: "Welcome to Casa De Luna!",
      html: Html,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
exports.LoginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user;
    if (username) {
      user = await Users.findOne({ username });
    } else if (email) {
      user = await Users.findOne({ email });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to authenticate user and attach user info to req,
// It used for protected routes
exports.accountInfo = async (req, res, next) => {
  // authHeader is the value from "Authorization" header that contains the token
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).populate("favorites").lean();
    try {
      console.log(
        "[UserControl] getProfile decodedId=",
        decoded.id,
        "role=",
        user && user.role
      );
    } catch (e) {
      //Here we ignore logging errors
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    // Populate favorites with full dish data from Menu collection
    let populatedFavorites = [];
    try {
      const Menu = require("../Models/MenuModel");
      if (Array.isArray(user.favorites) && user.favorites.length > 0) {
        populatedFavorites = user.favorites
          .filter((fav) => fav) // filter out null/undefined refs
          .map((fav) => ({
            _id: fav._id,
            name: fav.name,
            price: fav.price,
            img: fav.imageUrl,
          }));
      }
    } catch (e) {
      console.error("Error populating favorites:", e);
    }

    // Those are the fields needed in the profile response
    const history = user.history || [];
    try {
      const Menu = require("../Models/MenuModel");
      if (Array.isArray(user.orderItems) && user.orderItems.length > 0) {
        for (const oi of user.orderItems) {
          // oi: Order Item
          try {
            let name = oi.name || "Unknown item";
            if (oi.itemId) {
              const menuItem = await Menu.findById(oi.itemId).lean();
              if (menuItem && menuItem.name) name = menuItem.name;
            }
            history.push({
              type: "Order",
              details: `${name} x${oi.quantity || 1}`,
              date: oi.date || oi._id || null,
            });
          } catch (e) {
            history.push({
              type: "Order",
              details: `${oi.name || oi.itemId || "Item"} x${oi.quantity || 1}`,
              date: oi.date || oi._id || null,
            });
          }
        }
      }
    } catch (e) {
      // ignore menu lookup failures
    }

    // 3) Find reservations for this user's email and add them to history
    try {
      const Booking = require("../Models/Booking");
      if (user.email) {
        // match bookings by contact email
        const bookings = await Booking.find({
          "contactInfo.email": new RegExp(
            `^${user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        }).lean();
        for (const b of bookings) {
          history.push({
            type: "Reservation",
            details: `Reservation for ${b.date || "(no date)"} at ${
              b.time || "(no time)"
            } — ${b.numberOfPeople || "n/a"} people`,
            date: b.date || b._id || null,
          });
        }
      }
    } catch (e) {
      // ignore booking lookup errors
    }

    // simply here combine existing history with generated one
    const combinedHistory =
      Array.isArray(user.history) && user.history.length > 0
        ? user.history
        : history;

    const payload = {
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      phone: user.phone,
      address: user.address,
      role: user.role,
      favorites: populatedFavorites,
      history: combinedHistory || [],
      notifications: user.notifications || [],
      paymentMethods: user.paymentMethods || {},
      vipMembership: user.vipMembership || {},
    };
    res.json(payload);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {
      fullname,
      email,
      phone,
      address,
      favorites,
      history,
      paymentMethods,
      notifications,
    } = req.body || {};

    const updateFields = {};
    if (fullname !== undefined) updateFields.fullname = fullname;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (favorites !== undefined) updateFields.favorites = favorites;
    if (paymentMethods !== undefined)
      updateFields.paymentMethods = paymentMethods;
    if (notifications !== undefined) updateFields.notifications = notifications;
    if (history !== undefined) updateFields.history = history;

    const saved = await Users.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!saved) return res.status(404).json({ message: "User not found" });

    // Populate favorites before sending back so frontend can use full item data
    let populatedFavorites = [];
    try {
      const Menu = require("../Models/MenuModel");
      const favIds = (saved.favorites || []).map((f) =>
        f && f._id ? String(f._id) : String(f)
      );
      if (favIds.length > 0) {
        const menuItems = await Menu.find({ _id: { $in: favIds } }).lean();
        const menuById = {};
        menuItems.forEach((m) => (menuById[String(m._id)] = m));
        populatedFavorites = favIds
          .map((id) => {
            const m = menuById[String(id)];
            if (m)
              return {
                _id: m._id,
                name: m.name,
                price: m.price,
                img: m.imageUrl,
              };
            return null;
          })
          .filter(Boolean);
      }
    } catch (e) {
      populatedFavorites = saved.favorites || [];
    }

    res.json({
      message: "Profile updated",
      favorites: populatedFavorites,
      history: saved.history || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by admin
exports.updateUser = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await Users.findById(req.params.id);
    if (user) {
      const { fullname, email, username, password, role } = req.body;
      user.fullname = fullname;
      user.email = email;
      user.phone = phone;
      user.username = username;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.role = role || "user";
      const updatedUser = await user.save();
      await sendEmail({
        to: updatedUser.email,
        subject: "Your account has been updated",
        html: `
        <div style="max-width:600px; margin:40px auto; padding:30px 40px; background-color:#fdfaf6; border:2px solid #d8cfc0; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); font-family:Georgia, serif; color:#4b3e2d; position:relative;">
          <div style="font-family: cursive; font-size:36px; position:absolute; top:-30px; left:20px; color:#6b4c3b;">Casa De Luna</div>

          <p style="font-weight: bold; font-size: 18px;">Dearest ${updatedUser.fullname},</p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            We are pleased to inform you that your account details have been successfully updated.
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            With the highest regard,
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            The Honorable House of Casa De Luna
          </p>
        </div>
        `,
      });
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by admin
exports.deleteUser = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await Users.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
      await sendEmail({
        to: user.email,
        subject: "Your account has been deleted",
        html: `
        <div style="max-width:600px; margin:40px auto; padding:30px 40px; background-color:#fdfaf6; border:2px solid #d8cfc0; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); font-family:Georgia, serif; color:#4b3e2d; position:relative;">
          <div style="font-family: cursive; font-size:36px; position:absolute; top:-30px; left:20px; color:#6b4c3b;">Casa De Luna</div>

          <p style="font-weight: bold; font-size: 18px;">Dearest ${user.fullname},</p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            We regret to inform you that your account has been deleted.
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            With the highest regard,
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin: 12px 0;">
            The Honorable House of Casa De Luna
          </p>
        </div>
        `,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function that allow only the admin to access the page to add dish to the menu
exports.adminAccess = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register VIP membership for authenticated user
exports.registerVIP = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { tier = "gold", payment = "card" } = req.body || {};

    // Prevent duplicate VIP registration
    if (user.vipMembership && user.vipMembership.active) {
      return res.status(400).json({ message: "User is already a VIP member" });
    }

    // Validate tier and payment preference
    const allowedTiers = ["silver", "gold", "platinum"];
    const allowedPayments = ["card", "paypal", "cash"];
    const chosenTier = allowedTiers.includes(tier) ? tier : "gold";
    const chosenPayment = allowedPayments.includes(payment) ? payment : "card";

    // create a simple transaction id for receipt
    const tx = `VIP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    user.vipMembership = {
      active: true,
      tier: chosenTier,
      since: new Date(),
      paymentPreference: chosenPayment,
      txId: tx,
    };
    const saved = await user.save();

    // price map
    const priceMap = {
      silver: "$149.99",
      gold: "$299.99",
      platinum: "$499.99",
    };
    const amount = priceMap[chosenTier] || "$149.99";

    // send confirmation email with a small receipt/invoice
    const html = `
      <div style="font-family: Georgia, serif; padding: 30px; background: #fffaf2; border-radius:12px; color:#3b3b3b;">
        <h2 style="color:#6b4c3b; margin-bottom:6px">Your VIP Membership — Casa De Luna</h2>
        <p>Dear honorable ${saved.fullname},</p>
        <p>Thank you for joining our <strong>${chosenTier.toUpperCase()}</strong> VIP membership. Below are the details of your membership:</p>
        <table style="width:100%; border-collapse:collapse; margin-top:12px;">
          <tr><td style="padding:6px 0;">Membership Tier:</td><td style="text-align:right; font-weight:bold;">${chosenTier}</td></tr>
          <tr><td style="padding:6px 0;">Amount:</td><td style="text-align:right;">${amount}</td></tr>
          <tr><td style="padding:6px 0;">Payment Method:</td><td style="text-align:right;">${chosenPayment}</td></tr>
          <tr><td style="padding:6px 0;">Transaction ID:</td><td style="text-align:right; font-family: monospace;">${tx}</td></tr>
          <tr><td style="padding:6px 0;">Joined On:</td><td style="text-align:right;">${new Date(
            saved.vipMembership.since
          ).toLocaleString()}</td></tr>
        </table>
        <p style="margin-top:18px;">We’ve updated your account — enjoy exclusive discounts, priority service, and early access to new menu items.</p>
        <p style="margin-top:18px; font-weight:bold;">Warmly,<br/>The Casa De Luna Team</p>
      </div>
    `;
    await sendEmail({
      to: saved.email,
      subject: "VIP Membership Confirmation — Casa De Luna",
      html,
    });

    res.json({
      message: "VIP registered",
      vipMembership: saved.vipMembership,
      txId: tx,
    });
  } catch (error) {
    console.error("registerVIP error", error.message);
    res.status(500).json({ message: error.message });
  }
};
