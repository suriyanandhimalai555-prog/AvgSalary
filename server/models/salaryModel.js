import pool from '../config/db.js';

// 1. Modified to bind user_id to the row injection
export const createSalaryRecord = async (data, userId) => {
  const queryText = `
    INSERT INTO employee_salaries (
      user_id, employee_name, designation, bank_name, account_number, ifsc_code,
      renewal, new_amount, gold_coin, gvcn, lss, gvcr, trade, land, builders,
      total_efgh, renewal_15, new_20, salary, land_payout, commissions,
      grand_total, payout_10th, payout_16th
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    RETURNING *;
  `;

  const values = [
    userId, // Passed from auth middleware token decoding
    data.employeeName, data.designation, data.bankName, data.accountNumber, data.ifscCode,
    data.renewal, data.newAmount, data.goldCoin, data.gvcn, data.lss, data.gvcr, data.trade, data.land, data.builders,
    data.totalEFGH, data.renewal15, data.new20, data.salary, data.landPayout, data.commissions,
    data.grandTotal, data.payout10th, data.payout16th
  ];

  const result = await pool.query(queryText, values);
  return result.rows[0];
};

// 2. Modified to enforce strict isolation using WHERE user_id = $1
export const getAllSalaryRecords = async (userId) => {
  const queryText = `
    SELECT * FROM employee_salaries 
    WHERE user_id = $1 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(queryText, [userId]);
  return result.rows;
};

// Fetch all rows for admin overview across all branches
export const getAllRecordsForAdmin = async () => {
  const queryText = `
    SELECT s.*, u.branch, u.name as logged_by_user
    FROM employee_salaries s
    JOIN public.users u ON s.user_id = u.id
    ORDER BY s.created_at DESC;
  `;
  const result = await pool.query(queryText);
  return result.rows;
};