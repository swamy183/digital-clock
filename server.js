const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-clock';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Clock Settings Schema
const clockSettingsSchema = new mongoose.Schema({
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  userPreferences: {
    format24Hour: {
      type: Boolean,
      default: true
    },
    showSeconds: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    }
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ClockSettings = mongoose.model('ClockSettings', clockSettingsSchema);

// REST API Endpoints

// GET /api/clock/settings - Retrieve clock settings
app.get('/api/clock/settings', async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    
    let settings = await ClockSettings.findOne({ userId });
    
    // If no settings found, create default settings
    if (!settings) {
      settings = new ClockSettings({
        userId,
        timezone: 'UTC',
        userPreferences: {
          format24Hour: true,
          showSeconds: true,
          theme: 'auto',
          dateFormat: 'DD/MM/YYYY'
        }
      });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error retrieving clock settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve clock settings',
      message: error.message
    });
  }
});

// POST /api/clock/settings - Create or update clock settings
app.post('/api/clock/settings', async (req, res) => {
  try {
    const { userId, timezone, userPreferences } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }
    
    // Find existing settings or create new
    let settings = await ClockSettings.findOne({ userId });
    
    if (settings) {
      // Update existing settings
      if (timezone) settings.timezone = timezone;
      if (userPreferences) {
        settings.userPreferences = {
          ...settings.userPreferences,
          ...userPreferences
        };
      }
      settings.updatedAt = Date.now();
      await settings.save();
    } else {
      // Create new settings
      settings = new ClockSettings({
        userId,
        timezone: timezone || 'UTC',
        userPreferences: userPreferences || {}
      });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Clock settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving clock settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save clock settings',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});

module.exports = app;
