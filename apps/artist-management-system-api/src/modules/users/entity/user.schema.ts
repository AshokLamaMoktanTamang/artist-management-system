export const userSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  first_name: 'TEXT NOT NULL',
  last_name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  phone: 'TEXT NOT NULL',
  password: 'TEXT NOT NULL',
  dob: 'DATE NOT NULL',
  gender: 'TEXT NOT NULL',
  role: 'TEXT NOT NULL',
  deleted: 'BOOLEAN DEFAULT FALSE',
  deleted_at: 'TIMESTAMP',
};
