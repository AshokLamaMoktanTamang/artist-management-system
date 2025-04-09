export const userSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  first_name: 'TEXT NOT NULL',
  last_name: 'TEXT NOT NULL',
  email: 'TEXT NOT NULL',
  phone: 'TEXT NOT NULL',
  password: 'TEXT NOT NULL',
  dob: 'DATE NOT NULL',
  gender: 'TEXT NOT NULL',
  role: 'TEXT NOT NULL',
  deleted: 'BOOLEAN DEFAULT FALSE',
  deleted_at: 'TIMESTAMP',
};

export const userIndexes = [
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_role_not_deleted 
   ON users(email, role) 
   WHERE deleted IS FALSE`,

  `CREATE INDEX IF NOT EXISTS idx_users_role 
   ON users(role)`,
];
