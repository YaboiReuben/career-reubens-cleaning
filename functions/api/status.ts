import { createClient } from '@supabase/supabase-js';

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const supabase = createClient(
    context.env.VITE_SUPABASE_URL,
    context.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'appStatus')
      .single();
      
    return new Response(JSON.stringify({ status: data?.value || 'open' }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: 'open' }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const supabase = createClient(
    context.env.VITE_SUPABASE_URL,
    context.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const { status } = await context.request.json() as { status: string };
    
    if (['open', 'closing-soon', 'closed'].includes(status)) {
      await supabase
        .from('settings')
        .upsert({ key: 'appStatus', value: status });

      return new Response(JSON.stringify({ success: true, status }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to update status' }), { status: 500 });
  }
}
