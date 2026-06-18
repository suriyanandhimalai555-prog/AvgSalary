import pool from '../config/db.js';

export const createUser = async (name, email, hashedPassword, branch, role = 'user') => {
  const query = `
    INSERT INTO public.users (name, email, password, branch, role) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, name, email, branch, role, created_at;
  `;
  const values = [name, email, hashedPassword, branch, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM public.users WHERE email = $1;';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = 'SELECT id, name, email, branch, role, created_at FROM public.users WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// ADD THIS NEW EXPORTED FUNCTION AT THE BOTTOM:
export const getAllBranchUsers = async () => {
  const query = `
    SELECT id, name, email, branch, role, created_at 
    FROM public.users 
    WHERE role = 'user' 
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

export const updateUserPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE users 
    SET password = $1 
    WHERE id = $2 
    RETURNING id;
  `;
  const values = [hashedPassword, userId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};