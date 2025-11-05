const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// Input validation and sanitization
const validateIP = (ip) => {
  if (!ip || typeof ip !== 'string') return false;
  
  // Basic IP validation regex
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

const sanitizeIP = (ip) => {
  // Remove any potentially dangerous characters
  return ip.replace(/[^0-9.]/g, '');
};

const getMacAddress = (ip) => {
  return new Promise((resolve, reject) => {
    if (!ip || !validateIP(ip)) {
      return resolve(null);
    }

    const sanitizedIP = sanitizeIP(ip);
    const platform = process.platform;
    
    // Use safer command construction
    let cmd;
    if (platform === "win32") {
      cmd = `arp -a | find "${sanitizedIP}"`;
    } else {
      cmd = `arp -an | grep "(${sanitizedIP})"`;
    }

    // Set timeout and limit command execution
    const childProcess = exec(cmd, { 
      timeout: 5000, // 5 second timeout
      maxBuffer: 1024 * 1024 // 1MB buffer limit
    }, (error, stdout) => {
      if (error) {
        console.error("Error fetching MAC address:", error);
        return resolve("MAC_NOT_FOUND");
      }

      const macRegex = /([a-fA-F0-9]{2}[:-]){5}[a-fA-F0-9]{2}/;
      const macMatch = stdout.match(macRegex);
      resolve(macMatch ? macMatch[0] : "MAC_NOT_FOUND");
    });

    // Kill process if it takes too long
    setTimeout(() => {
      if (childProcess && !childProcess.killed) {
        childProcess.kill();
        resolve("MAC_NOT_FOUND");
      }
    }, 6000);
  });
};

router.get("/device/info", async (req, res) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ipFromForwarded = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0];
    const ip = req.query.ip || ipFromForwarded || req.ip || req.connection?.remoteAddress;

    if (!ip || !validateIP(ip)) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid IP address is required." 
      });
    }

    const macAddress = await getMacAddress(ip);
    return res.json({
      success: true,
      data: {
        macAddress,
        ipAddress: ip,
        deviceId: macAddress !== "MAC_NOT_FOUND" ? macAddress : ip,
      },
    });
  } catch (error) {
    console.error("/device/info error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
