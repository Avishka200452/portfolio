import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Data helpers ──────────────────────────────────────────────────────────────

export async function getMeta() {
  const { data } = await supabase.from('portfolio_meta').select('*').single();
  return data;
}

export async function getWorks(category) {
  const { data } = await supabase
    .from('works')
    .select('*')
    .eq('category', category)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getTimeline() {
  const { data } = await supabase
    .from('timeline_items')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getSocialLinks() {
  const { data } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  const links = data || [];
  const hasFb = links.some(l => (l.platform || '').toLowerCase().includes('facebook') || (l.platform || '').toLowerCase().includes('fb'));
  if (!hasFb) {
    return [
      ...links,
      {
        id: 'default-facebook',
        platform: 'Facebook',
        url: 'https://www.facebook.com/avishka.bambaradeniya',
        icon: 'Avishka Bambaradeniya',
        sort_order: links.length ? Math.max(...links.map(l => l.sort_order || 0)) + 1 : 3,
      }
    ];
  }
  return links;
}

export async function getProcessSteps() {
  const { data } = await supabase
    .from('process_steps')
    .select('*')
    .order('step_number', { ascending: true });
  return data || [];
}

// ── Storage helpers ───────────────────────────────────────────────────────────

export async function uploadFile(bucket, file, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteFile(bucket, path) {
  await supabase.storage.from(bucket).remove([path]);
}
