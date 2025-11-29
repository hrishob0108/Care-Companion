const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Elderly = require("./models/Elderly");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;

  console.log("Received data:", { name, email, password, mobileNumber });

  if (!name || !email || !password || !mobileNumber) {
    console.log("Missing fields:", { name, email, password, mobileNumber });
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    console.log("Checking if user exists:", userExists);

    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "family",
      mobileNumber,
    });

    console.log("Creating new user:", newUser);

    await newUser.save();
    console.log("New user saved successfully:", newUser);

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );
    console.log("Generated JWT Token:", token);

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error in user creation:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt: Email - ${email}`);

  if (!email || !password) {
    console.log(`Missing credentials: Email or Password not provided`);
    return res.status(400).json({ error: "Email and password are required" });
  }

  let user = await User.findOne({ email });
  if (!user) {
    console.log(`User not found in User model. Searching in Elderly model...`);
    user = await Elderly.findOne({ email });
  }

  if (!user) {
    console.log(`User with email ${email} not found`);
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log(`Invalid credentials: Incorrect password for user ${email}`);
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    "your_jwt_secret_key",
    { expiresIn: "1h" }
  );

  console.log(`Login successful for user ${email}. Token generated.`);
  res.json({ message: "Login successful", token });
});

app.post("/create-elderly", async (req, res) => {
  const {
    name,
    email,
    password,
    healthData: { age, gender, medications, allergies, emergencyContact } = {},
  } = req.body;

  console.log("Received request to create elderly user with data:", req.body);

  if (!name || !email || !password || !age || !gender) {
    console.log("Validation failed: Missing required fields.");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const elderlyExists = await Elderly.findOne({ email });
    if (elderlyExists) {
      console.log(`Elderly user already exists with email: ${email}`);
      return res.status(400).json({ error: "Elderly user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    // Ensure medications are properly formatted before saving
    const formattedMedications = medications.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      schedule: med.schedule || [], // Ensure schedule is always an array
      duration: med.duration || "7 days", // Default to "7 days" if no duration provided
    }));

    const newElderly = new Elderly({
      name,
      email,
      password: hashedPassword,
      role: "elderly",
      healthData: {
        age,
        gender,
        medications: formattedMedications,
        allergies: allergies || [],
        emergencyContact,
      },
    });

    await newElderly.save();
    console.log(`New elderly user created with ID: ${newElderly._id}`);

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("Authorization token missing in request.");
      return res.status(403).json({ error: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret_key");
    console.log("JWT token decoded:", decoded);

    const familyId = decoded.userId;
    const familyUser = await User.findById(familyId);
    if (!familyUser) {
      console.log(`Family member not found with ID: ${familyId}`);
      return res.status(400).json({ error: "Family member not found" });
    }

    familyUser.familyMembers.push({
      userId: newElderly._id,
      relationship: "Parent",
    });

    await familyUser.save();
    console.log(
      `Family member with ID: ${familyId} updated with new elderly user.`
    );

    res.status(201).json({
      message: "Elderly user created and added to family",
      elderly: newElderly,
    });
  } catch (error) {
    console.error("Error during elderly user creation:", error);
    res.status(500).json({ error: "Failed to create elderly user" });
  }
});

const verifyToken = (req, res, next) => {
  console.log("Request Headers:", req.headers); // Log the headers to check the Authorization token

  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/elderly/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from decoded JWT token

    // Check if the user has this elderly member in their family
    const user = await User.findById(userId);

    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const familyMember = user.familyMembers.find(
      (member) => member.userId.toString() === req.params.id
    );

    if (!familyMember) {
      return res
        .status(404)
        .json({ error: "Elderly member not found in your family" });
    }

    // If the elderly member is found in the family, fetch their details
    const elderlyMember = await Elderly.findById(req.params.id);
    if (!elderlyMember) {
      return res.status(404).json({ error: "Elderly member not found" });
    }

    res.json(elderlyMember);
  } catch (error) {
    console.error("Error fetching elderly member:", error);
    res.status(500).json({ error: "Failed to fetch elderly member" });
  }
});

app.get("/family-members", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from decoded JWT token
    const user = await User.findById(userId).populate("familyMembers.userId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const familyData = await Promise.all(
      user.familyMembers.map(async (member) => {
        const elderlyMember = await Elderly.findById(member.userId);
        if (elderlyMember) {
          return {
            id: elderlyMember._id,
            name: elderlyMember.name,
            relation: member.relationship,
            healthData: elderlyMember.healthData,
          };
        }
        return null;
      })
    );

    res.json(familyData.filter(Boolean));
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({ error: "Failed to fetch family members" });
  }
});

app.get("/medications", verifyToken, async (req, res) => {
  console.log("Requested received for userId:", req.user.userId); // Log the userId

  try {
    const elderlyUserId = req.user.userId;

    // Check if the elderly user exists in the database
    const elderlyUser = await Elderly.findById(elderlyUserId);
    console.log("Elderly user fetched from DB:", elderlyUser); // Log the fetched user

    if (!elderlyUser) {
      return res.status(404).json({ error: "Elderly user not found" });
    }

    // Log the medications to check if they're available
    console.log("Medications:", elderlyUser.healthData.medications);

    // Return medications
    res.status(200).json(elderlyUser.healthData.medications);
  } catch (err) {
    console.error("Error fetching medications:", err);
    res.status(500).json({ error: "Failed to fetch medications" });
  }
});

app.put("/elderly/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from decoded JWT token

    // Check if the user has this elderly member in their family
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const familyMember = user.familyMembers.find(
      (member) => member.userId.toString() === req.params.id
    );

    if (!familyMember) {
      return res
        .status(404)
        .json({ error: "Elderly member not found in your family" });
    }

    // Find the elderly member and update
    const elderlyMember = await Elderly.findById(req.params.id);
    if (!elderlyMember) {
      return res.status(404).json({ error: "Elderly member not found" });
    }

    // Update elderly member details
    const { name, email, healthData } = req.body;

    elderlyMember.name = name || elderlyMember.name;
    elderlyMember.email = email || elderlyMember.email;
    elderlyMember.healthData = {
      ...elderlyMember.healthData,
      ...healthData,
    };

    await elderlyMember.save();
    res.json({
      message: "Elderly member updated successfully",
      elderly: elderlyMember,
    });
  } catch (error) {
    console.error("Error updating elderly member:", error);
    res.status(500).json({ error: "Failed to update elderly member" });
  }
});

module.exports = app;
