import { createClient } from '@supabase/supabase-js';

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const supabase = createClient(
    context.env.VITE_SUPABASE_URL,
    context.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const formData = await context.request.json() as any;
    
    // 1. Save to Supabase
    const { error } = await supabase
      .from('submissions')
      .insert([{ data: formData }]);

    if (error) {
      console.error('Supabase Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save application' }), { status: 500 });
    }

    // 2. Send to Discord
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1477532820946686146/sOMw4aJV92Rtxl83Ug03e7ABsJGKLNQI7-116fQNy4UolsJDAoVqTahwoFr3ITll-wUp';
    
    const embed = {
      title: "New Staff Application",
      color: 3447003, // Blue
      fields: [
        { name: "Name", value: formData.fullName || 'N/A', inline: true },
        { name: "Phone", value: formData.phone || 'N/A', inline: true },
        { name: "Suburb", value: formData.suburb || 'N/A', inline: true },
        { name: "Availability", value: formData.availability || 'N/A' },
        { name: "Experience", value: (formData.experience || '').substring(0, 1024) },
      ],
      footer: { text: "Reuben's Cleaning Service Portal" },
      timestamp: new Date().toISOString()
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to process submission' }), { status: 500 });
  }
}
