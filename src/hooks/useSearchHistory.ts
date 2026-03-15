import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAnonUserId } from '@/lib/anonUser';

export interface SearchHistoryItem {
  id: string;
  query: string;
  response: string;
  created_at: string;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const anonId = getAnonUserId();
      const { data, error } = await supabase
        .from('search_history')
        .select('id, query, response, created_at')
        .eq('anon_id', anonId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) {
        setHistory(data as SearchHistoryItem[]);
      }
    } catch (e) {
      console.error('Failed to fetch search history:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSearch = useCallback(async (query: string, response: string) => {
    try {
      const anonId = getAnonUserId();
      await supabase.from('search_history').insert({
        anon_id: anonId,
        query,
        response,
      } as any);
      // Refresh history
      fetchHistory();
    } catch (e) {
      console.error('Failed to save search:', e);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, saveSearch, refresh: fetchHistory };
}
