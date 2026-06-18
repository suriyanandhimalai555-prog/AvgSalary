import * as SalaryModel from '../models/salaryModel.js';

export const submitSalary = async (req, res) => {
  try {
    const {
      employeeName, designation, bankName, accountNumber, ifscCode
    } = req.body;

    if (!employeeName || !designation || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: 'Missing mandatory operational entry values.' });
    }

    // Extracting user ID safely out of verified request session headers
    const userId = req.user.id; 

    const newRecord = await SalaryModel.createSalaryRecord(req.body, userId);
    return res.status(201).json({ message: 'Ledger matrix saved successfully!', data: newRecord });
  } catch (error) {
    console.error('Error in submitSalary controller:', error);
    return res.status(500).json({ message: 'Internal server error processing compilation matrix.' });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    // Read user id directly from verification state token layer
    const userId = req.user.id; 
    
    const rows = await SalaryModel.getAllSalaryRecords(userId);
    
    // Formatting snake_case from DB into camelCase for frontend components
    const formattedData = rows.map(item => ({
      id: item.id,
      employeeName: item.employee_name,
      designation: item.designation,
      bankName: item.bank_name,
      accountNumber: item.account_number,
      ifscCode: item.ifsc_code,
      renewal: item.renewal,
      newAmount: item.new_amount,
      goldCoin: item.gold_coin,
      gvcn: item.gvcn,
      lss: item.lss,
      gvcr: item.gvcr,
      trade: item.trade,
      land: item.land,
      builders: item.builders,
      totalEFGH: item.total_efgh,
      renewal15: item.renewal_15,
      new20: item.new_20,
      salary: item.salary,
      landPayout: item.land_payout,
      commissions: item.commissions,
      grandTotal: item.grand_total,
      payout10th: item.payout_10th,
      payout16th: item.payout_16th,
      created_at: item.created_at
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error in getMySubmissions controller:', error);
    return res.status(500).json({ message: 'Failed fetching log matrices.' });
  }
};

export const getAdminMasterLedger = async (req, res) => {
  try {
    // Explicitly verify caller status via security check layer
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Administrative node privileges required.' });
    }

    const rows = await SalaryModel.getAllRecordsForAdmin();
    
    const formattedData = rows.map(item => ({
      id: item.id,
      branch: item.branch,
      loggedByUser: item.logged_by_user,
      employeeName: item.employee_name,
      designation: item.designation,
      bankName: item.bank_name,
      accountNumber: item.account_number,
      ifscCode: item.ifsc_code,
      renewal: item.renewal,
      newAmount: item.new_amount,
      goldCoin: item.gold_coin,
      gvcn: item.gvcn,
      lss: item.lss,
      gvcr: item.gvcr,
      trade: item.trade,
      land: item.land,
      builders: item.builders,
      totalEFGH: item.total_efgh,
      renewal15: item.renewal_15,
      new20: item.new_20,
      salary: item.salary,
      landPayout: item.land_payout,
      commissions: item.commissions,
      grandTotal: item.grand_total,
      payout10th: item.payout_10th,
      payout16th: item.payout_16th,
      created_at: item.created_at
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error in getAdminMasterLedger:', error);
    return res.status(500).json({ message: 'Failed fetching master administrative dataset matrices.' });
  }
};

export const getEmployeeList = async (req, res) => {
  try {
    // Fetches unique names and their existing details to populate the dropdown
    const query = `
      SELECT DISTINCT ON (employee_name) 
      employee_name, designation, bank_name, account_number, ifsc_code 
      FROM employee_salaries 
      ORDER BY employee_name, created_at DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee list' });
  }
};