"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const init_1 = require("../database/init");
const router = express_1.default.Router();
exports.rationRoutes = router;
// Get available stocks endpoint
router.get('/stocks', async (req, res) => {
    try {
        const stocks = await new Promise((resolve, reject) => {
            init_1.db.all(`
        SELECT 
          ri.id,
          ri.name,
          ri.unit,
          ri.price_per_unit,
          COALESCE(ss.quantity, 0) as shop_stock
        FROM ration_items ri
        LEFT JOIN shop_stock ss ON ri.id = ss.item_id
        ORDER BY ri.name
      `, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        res.json({
            stocks: stocks || [],
        });
    }
    catch (error) {
        console.error('Get stocks error:', error);
        res.status(500).json({ message: 'Failed to fetch stocks' });
    }
});
// Get user quota endpoint
router.get('/quota/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const quotas = await new Promise((resolve, reject) => {
            init_1.db.all(`
        SELECT 
          uq.id,
          uq.item_id,
          ri.name as item_name,
          ri.unit,
          uq.monthly_quota,
          uq.used_quota,
          (uq.monthly_quota - uq.used_quota) as remaining_quota
        FROM user_quotas uq
        JOIN ration_items ri ON uq.item_id = ri.id
        WHERE uq.member_id = ? AND uq.month_year = ?
        ORDER BY ri.name
      `, [memberId, currentMonth], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        res.json({
            quotas: quotas || [],
        });
    }
    catch (error) {
        console.error('Get quota error:', error);
        res.status(500).json({ message: 'Failed to fetch quota' });
    }
});
// Get transaction history endpoint
router.get('/transactions/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;
        const transactions = await new Promise((resolve, reject) => {
            init_1.db.all(`
        SELECT 
          t.id,
          t.quantity,
          t.amount,
          t.status,
          t.created_at,
          ri.name as item_name,
          ri.unit
        FROM transactions t
        JOIN ration_items ri ON t.item_id = ri.id
        WHERE t.member_id = ?
        ORDER BY t.created_at DESC
        LIMIT 50
      `, [memberId], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        res.json({
            transactions: transactions || [],
        });
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});
// Initiate transaction endpoint
router.post('/initiate-transaction', async (req, res) => {
    try {
        const { memberId, qrCode } = req.body;
        if (!memberId || !qrCode) {
            return res.status(400).json({ message: 'Member ID and QR code are required' });
        }
        // In a real app, you would validate the QR code with the dealer's system
        // For demo purposes, we'll create a mock transaction
        const transactionId = `TXN${Date.now()}`;
        const shopId = 'SHOP001';
        // Create a mock transaction
        await new Promise((resolve, reject) => {
            init_1.db.run(`
        INSERT INTO transactions (id, member_id, item_id, quantity, amount, shop_id, status, qr_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [transactionId, memberId, 'I001', 5.0, 225.0, shopId, 'pending', qrCode], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
        });
        res.json({
            message: 'Transaction initiated successfully',
            transactionId,
            status: 'pending',
        });
    }
    catch (error) {
        console.error('Initiate transaction error:', error);
        res.status(500).json({ message: 'Failed to initiate transaction' });
    }
});
//# sourceMappingURL=ration.js.map