import { db } from '../db';
import { supabase } from './supabase';

const MIGRATION_VERSION = 'v1';
const MIGRATION_KEY_PREFIX = `dexie_to_supabase_migrated_${MIGRATION_VERSION}`;

const chunkArray = <T,>(items: T[], chunkSize = 500) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
};

export interface MigrationResult {
  skipped: boolean;
  migratedProgressCount: number;
  migratedBookmarkCount: number;
}

export const migrateDexieToSupabase = async (): Promise<MigrationResult> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('로그인된 사용자 정보가 없습니다.');
  }

  const migrationKey = `${MIGRATION_KEY_PREFIX}_${userId}`;
  const alreadyMigrated = localStorage.getItem(migrationKey);
  if (alreadyMigrated) {
    return { skipped: true, migratedProgressCount: 0, migratedBookmarkCount: 0 };
  }

  const [studyRecords, bookmarks] = await Promise.all([
    db.studyRecords.toArray(),
    db.bookmarks.toArray(),
  ]);

  const progressRows = studyRecords.map((record) => ({
    user_id: userId,
    word_id: record.wordId,
    is_mastered: record.memoryScore >= 3,
    last_reviewed_at: record.lastStudied ? new Date(record.lastStudied).toISOString() : null,
  }));

  const bookmarkRows = bookmarks.map((bookmark) => ({
    user_id: userId,
    word_id: bookmark.wordId,
    created_at: bookmark.createdAt ? new Date(bookmark.createdAt).toISOString() : new Date().toISOString(),
  }));

  for (const chunk of chunkArray(progressRows)) {
    const { error } = await supabase
      .from('user_progress')
      .upsert(chunk, { onConflict: 'user_id,word_id' });
    if (error) throw error;
  }

  for (const chunk of chunkArray(bookmarkRows)) {
    const { error } = await supabase
      .from('word_bookmarks')
      .upsert(chunk, { onConflict: 'user_id,word_id' });
    if (error) throw error;
  }

  localStorage.setItem(migrationKey, new Date().toISOString());

  return {
    skipped: false,
    migratedProgressCount: progressRows.length,
    migratedBookmarkCount: bookmarkRows.length,
  };
};
