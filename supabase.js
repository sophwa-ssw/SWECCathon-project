// supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common database operations
export const gameHelpers = {
  async createGame(gameData) {
    return await supabase.from('games').insert([gameData]).select();
  },

  async joinGame(gameCode, playerData) {
    return await supabase.from('players').insert([{
      ...playerData,
      game_id: gameCode,
      created_at: new Date().toISOString()
    }]);
  },

  async updateGameStatus(gameCode, status) {
    return await supabase
      .from('games')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('code', gameCode);
  },

  async getGameTasks(gameCode) {
    return await supabase
      .from('game_tasks')
      .select('*')
      .eq('game_id', gameCode);
  },

  async updateTaskStatus(taskId, status) {
    return await supabase
      .from('game_tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', taskId);
  },

  async getPlayerProgress(gameCode, userId) {
    return await supabase
      .from('user_task_progress')
      .select('*')
      .eq('game_id', gameCode)
      .eq('user_id', userId);
  }
};
