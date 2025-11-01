const express = require('express');
const router = express.Router();
const ClockSettings = require('../models/ClockSettings');

// GET /api/clock/settings - Fetch current clock settings
router.get('/api/clock/settings', async (req, res) => {
  try {
    // Find the first settings document, or create one if it doesn't exist
    let settings = await ClockSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new ClockSettings({
        format: '24',
        timezone: 'UTC',
        showSeconds: true
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching clock settings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch clock settings',
      message: error.message 
    });
  }
});

// POST /api/clock/settings - Update clock settings
router.post('/api/clock/settings', async (req, res) => {
  try {
    const { format, timezone, showSeconds } = req.body;
    
    // Validation
    if (format && !['12', '24'].includes(format)) {
      return res.status(400).json({ 
        error: 'Invalid format',
        message: 'Format must be either "12" or "24"' 
      });
    }
    
    if (timezone && typeof timezone !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid timezone',
        message: 'Timezone must be a string' 
      });
    }
    
    if (showSeconds !== undefined && typeof showSeconds !== 'boolean') {
      return res.status(400).json({ 
        error: 'Invalid showSeconds',
        message: 'showSeconds must be a boolean' 
      });
    }
    
    // Find and update settings, or create new if doesn't exist
    let settings = await ClockSettings.findOne();
    
    if (!settings) {
      settings = new ClockSettings({
        format: format || '24',
        timezone: timezone || 'UTC',
        showSeconds: showSeconds !== undefined ? showSeconds : true
      });
    } else {
      if (format) settings.format = format;
      if (timezone) settings.timezone = timezone;
      if (showSeconds !== undefined) settings.showSeconds = showSeconds;
    }
    
    await settings.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating clock settings:', error);
    res.status(500).json({ 
      error: 'Failed to update clock settings',
      message: error.message 
    });
  }
});

module.exports = router;
