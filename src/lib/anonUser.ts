const STORAGE_KEY = 'anon_user_id';

export function getAnonUserId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = `anon_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
