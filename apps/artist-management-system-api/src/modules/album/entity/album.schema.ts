export const albumSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  title: 'TEXT NOT NULL',
  release_date: 'DATE',
  genre: 'TEXT NOT NULL',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  is_draft: 'BOOLEAN DEFAULT TRUE',
  cover: 'TEXT',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  deleted: 'BOOLEAN DEFAULT FALSE',
  deleted_at: 'TIMESTAMP',
};

export const albumIndexes = [
  `CREATE INDEX IF NOT EXISTS idx_album_user_id 
     ON album(user_id)`,

  `CREATE INDEX IF NOT EXISTS idx_album_genre 
     ON album(genre)`,

  `CREATE INDEX IF NOT EXISTS idx_album_is_draft 
     ON album(is_draft)`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_album_title_user_not_deleted 
     ON album(title, user_id) 
     WHERE deleted IS FALSE`,
];
