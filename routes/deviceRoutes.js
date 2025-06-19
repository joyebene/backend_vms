import express from 'express';
import Device from '../models/Device.js';
import Visitor from '../models/Visitor.js';
import Contractor from '../models/Contractor.js';

const router = express.Router();

// GET: All devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch devices" });
  }
});

// PUT: Toggle device status
router.put('/:id/status', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    device.status = !device.status;
    await device.save();

    if (device.apiEndpoint?.startsWith("http")) {
      try {
        await fetch(device.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: device.status }),
        });
      } catch (err) {
        console.error("API call failed:", err.message);
      }
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
});

// PATCH: Update device API URL
router.patch('/:id/url', async (req, res) => {
  try {
    const { apiEndpoint } = req.body;
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { apiEndpoint },
      { new: true }
    );
    if (!device) return res.status(404).json({ message: "Device not found" });

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: "Failed to update URL" });
  }
});

// add device
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: "Missing name or type" });

    const device = await Device.create({ name, type });
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: "Failed to create device" });
  }
});




// POST: QR Code verification for access control (Visitor or Contractor)
router.post('/verify', async (req, res) => {
  try {
    const { userId, validUntil, deviceId, userType } = req.body;

    if (!userId || !deviceId || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (new Date() > new Date(validUntil)) {
      return res.status(400).json({ message: "QR code expired" });
    }

    let user;
    if (userType === "visitor") {
      user = await Visitor.findById(userId);
    } else if (userType === "contractor") {
      user = await Contractor.findById(userId);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user || user.status !== "approved") {
      return res.status(403).json({ message: "User not approved or not found" });
    }

    const device = await Device.findById(deviceId);
    if (!device || !device.apiEndpoint) {
      return res.status(404).json({ message: "Device not found" });
    }

    await fetch(device.apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: true }),
    });

    return res.status(200).json({ message: "Access granted. Door opened." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

export default router;
