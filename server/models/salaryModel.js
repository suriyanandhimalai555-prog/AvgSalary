import pool from '../config/db.js';

export const createSalaryRecord = async (data, userId) => {
  const queryText = `
    INSERT INTO employee_salaries (
      user_id, employee_name, designation, bank_name, account_number, ifsc_code,
      salary_month,
      renewal, new_amount, gold_coin, gvcn, lss, gvcr, trade, land, builders,
      total_efgh, renewal_15, new_20, salary, land_payout, commissions,
      grand_total, payout_10th, payout_16th
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7,
      $8, $9, $10, $11, $12, $13, $14, $15, $16,
      $17, $18, $19, $20, $21, $22,
      $23, $24, $25
    )
    RETURNING *;
  `;

  const employeeName = String(data.employeeName || '').trim();
  const designation = String(data.designation || '').trim();
  const bankName = String(data.bankName || '').trim();
  const accountNumber = String(data.accountNumber || '').trim();
  const ifscCode = String(data.ifscCode || '').trim();

  const salaryMonth = data.salaryMonth
    ? new Date(`${data.salaryMonth}-01`)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const values = [
    userId,
    employeeName,
    designation,
    bankName,
    accountNumber,
    ifscCode,
    salaryMonth,
    data.renewal,
    data.newAmount,
    data.goldCoin,
    data.gvcn,
    data.lss,
    data.gvcr,
    data.trade,
    data.land,
    data.builders,
    data.totalEFGH,
    data.renewal15,
    data.new20,
    data.salary,
    data.landPayout,
    data.commissions,
    data.grandTotal,
    data.payout10th,
    data.payout16th
  ];

  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export const getEmployeeList = async (userId) => {
  const queryText = `
    SELECT DISTINCT ON (employee_name)
      employee_name,
      designation,
      bank_name,
      account_number,
      ifsc_code
    FROM employee_salaries
    WHERE user_id = $1
    ORDER BY employee_name, created_at DESC;
  `;

  const result = await pool.query(queryText, [userId]);
  return result.rows;
};

export const getEmployeeWiseRecords = async (userId) => {
  const queryText = `
    WITH latest_employee_profile AS (
      SELECT DISTINCT ON (employee_name)
        employee_name,
        designation,
        bank_name,
        account_number,
        ifsc_code
      FROM employee_salaries
      WHERE user_id = $1
      ORDER BY employee_name, created_at DESC
    )
    SELECT
      p.employee_name,
      p.designation,
      p.bank_name,
      p.account_number,
      p.ifsc_code,
      COALESCE(
        json_agg(
          json_build_object(
            'id', s.id,
            'salaryMonth', s.salary_month,
            'renewal', s.renewal,
            'newAmount', s.new_amount,
            'goldCoin', s.gold_coin,
            'gvcn', s.gvcn,
            'lss', s.lss,
            'gvcr', s.gvcr,
            'trade', s.trade,
            'land', s.land,
            'builders', s.builders,
            'totalEFGH', s.total_efgh,
            'renewal15', s.renewal_15,
            'new20', s.new_20,
            'salary', s.salary,
            'landPayout', s.land_payout,
            'commissions', s.commissions,
            'grandTotal', s.grand_total,
            'payout10th', s.payout_10th,
            'payout16th', s.payout_16th,
            'created_at', s.created_at
          )
          ORDER BY s.salary_month DESC, s.created_at DESC
        ),
        '[]'::json
      ) AS months
    FROM latest_employee_profile p
    JOIN employee_salaries s
      ON s.user_id = $1
     AND s.employee_name = p.employee_name
    GROUP BY
      p.employee_name,
      p.designation,
      p.bank_name,
      p.account_number,
      p.ifsc_code
    ORDER BY p.employee_name ASC;
  `;

  const result = await pool.query(queryText, [userId]);
  return result.rows;
};

export const getAllSalaryRecords = async (userId) => {
  const queryText = `
    SELECT *
    FROM employee_salaries
    WHERE user_id = $1
    ORDER BY employee_name ASC, salary_month DESC, created_at DESC;
  `;
  const result = await pool.query(queryText, [userId]);
  return result.rows;
};

export const getAllRecordsForAdmin = async () => {
  const queryText = `
    SELECT s.*, u.branch, u.name AS logged_by_user
    FROM employee_salaries s
    JOIN public.users u ON s.user_id = u.id
    ORDER BY s.employee_name ASC, s.salary_month DESC, s.created_at DESC;
  `;
  const result = await pool.query(queryText);
  return result.rows;
};