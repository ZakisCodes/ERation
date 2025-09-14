
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';

const router = express.Router();

// Generate OTP
//function generateOTP(): string {
  //return Math.floor(100000 + Math.random() * 900000).toString();
//}
// demo-auth.ts



// Demo ration card constant (should match frontend format, e.g., RC12345678)
const DEMO_RATION_ID = 'RC32165487';

// Simple in-memory OTP store for demo purposes
type OTPRecord = {
  id: string;
  rationCardId: string;
  mobileNumber: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
};
const otpStore = new Map<string, OTPRecord>(); // key: `${rationCardId}:${mobileNumber}`

// helper to create the map key
const otpKey = (rationCardId: string, mobileNumber: string) =>
  `${rationCardId}:${mobileNumber}`;

// simple OTP generator
function generateOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

/**
 * /send-otp
 * - Bypasses DB check.
 * - Accepts rationCardId and mobileNumber in body.
 * - ONLY allows the demo ration card id (DEMO_RATION_ID) to continue.
 * - Generates OTP and stores it in in-memory store.
 */
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { rationCardId, mobileNumber } = req.body;

    if (!rationCardId || !mobileNumber) {
      return res.status(400).json({
        message: 'Ration Card ID and Mobile Number are required',
      });
    }

    // Bypass DB: require the demo ration id to match
    if (rationCardId !== DEMO_RATION_ID) {
      return res.status(404).json({
        message:
          'Ration card not found (demo mode). Use demo ration ID: ' +
          DEMO_RATION_ID,
      });
    }

    // Generate and store OTP in-memory
    const otp = generateOTP();
    const otpId = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const record: OTPRecord = {
      id: otpId,
      rationCardId,
      mobileNumber,
      otp,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    };

    otpStore.set(otpKey(rationCardId, mobileNumber), record);

    // In a real app you'd send SMS. For demo, print to console and optionally return.
    console.log(`[Demo OTP] ${mobileNumber} -> ${otp}`);

    return res.json({
      message: 'OTP sent successfully (demo mode)',
      ...(process.env.NODE_ENV === 'development' && { otp }), // include OTP only in dev
    });
  } catch (error) {
    console.error('Send OTP error (demo):', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

/**
 * /verify-otp
 * - Verifies OTP from the in-memory store for the demo ration id.
 * - Marks OTP used and returns a JWT.
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { otp, rationCardId, mobileNumber } = req.body;

    if (!otp || !rationCardId || !mobileNumber) {
      return res.status(400).json({
        message: 'OTP, Ration Card ID and Mobile Number are required',
      });
    }

    // Only allow demo ration id in this demo flow
    if (rationCardId !== DEMO_RATION_ID) {
      return res.status(404).json({
        message:
          'Ration card not found (demo mode). Use demo ration ID: ' +
          DEMO_RATION_ID,
      });
    }

    const key = otpKey(rationCardId, mobileNumber);
    const record = otpStore.get(key);

    // basic checks: exist, match, not used, not expired
    if (
      !record ||
      record.isUsed ||
      record.otp !== otp ||
      record.expiresAt.getTime() <= Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // mark OTP used
    record.isUsed = true;
    otpStore.set(key, record);

    // generate JWT token
    const token = jwt.sign(
      { rationCardId, mobileNumber },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'OTP verified successfully (demo mode)',
      token,
    });
  } catch (error) {
    console.error('Verify OTP error (demo):', error);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
});


// Get family members endpoint
router.get('/family-members/:rationCardId', async (req, res) => {
  try {
    const { rationCardId } = req.params;
    
    const members = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM family_members WHERE ration_card_id = ? ORDER BY created_at',
        [rationCardId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      members: members || [],
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({ message: 'Failed to fetch family members' });
  }
});

// Verify government ID endpoint
router.post('/verify-id', async (req, res) => {
  try {
    const { memberId, governmentIdType, governmentIdNumber } = req.body;

    if (!memberId || !governmentIdType || !governmentIdNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // In a real app, you would verify the government ID with external APIs
    // For demo purposes, we'll just validate the format and mark as verified

    let isValid = false;
    switch (governmentIdType) {
      case 'aadhaar':
        isValid = /^\d{12}$/.test(governmentIdNumber.replace(/\s/g, ''));
        break;
        case 'pan':
          isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(governmentIdNumber);
        break;
        case 'voter_id':
        isValid = /^[A-Z]{3}[0-9]{7}$/.test(governmentIdNumber);
        break;
        case 'driving_license':
        isValid = /^DL\d{13}$/.test(governmentIdNumber);
        break;
      }
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid government ID format' });
      }
      
      // Update member with government ID
      await new Promise((resolve, reject) => {
      db.run(
        'UPDATE family_members SET government_id = ?, government_id_type = ?, verification_status = "verified", is_verified = TRUE WHERE id = ?',
        [governmentIdNumber, governmentIdType, memberId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    res.json({
      message: 'Government ID verified successfully',
    });
  } catch (error) {
    console.error('Verify ID error:', error);
    res.status(500).json({ message: 'Failed to verify government ID' });
  }
});

// Complete verification endpoint
router.post('/complete-verification', async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }
    
    // Update member verification status
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE family_members SET verification_status = "verified", is_verified = TRUE WHERE id = ?',
        [memberId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    res.json({
      message: 'Verification completed successfully',
    });
  } catch (error) {
    console.error('Complete verification error:', error);
    res.status(500).json({ message: 'Failed to complete verification' });
  }
});

export { router as authRoutes };
