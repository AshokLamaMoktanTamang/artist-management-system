export const musicSchema = {
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

export const musicIndexes = [
  `CREATE INDEX IF NOT EXISTS idx_music_user_id 
     ON music(user_id)`,

  `CREATE INDEX IF NOT EXISTS idx_music_genre 
     ON music(genre)`,

  `CREATE INDEX IF NOT EXISTS idx_music_is_draft 
     ON music(is_draft)`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_music_title_user_not_deleted 
     ON music(title, user_id) 
     WHERE deleted IS FALSE`,
];
