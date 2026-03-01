interface Env {
  REUBEN_DB: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.json() as any;
    
    // 1. Save to KV (Append to list)
    // Note: In a high-volume app, this read-modify-write is not race-condition safe.
    // For a small business hiring form, it's acceptable.
    let submissions = [];
    try {
      const existing = await context.env.REUBEN_DB.get("submissions");
      if (existing) {
        submissions = JSON.parse(existing);
      }
    } catch (e) {
      // Ignore error, start empty
    }

    const newSubmission = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    submissions.unshift(newSubmission); // Add to top
    
    // Limit to last 100 submissions to prevent KV size limits
    if (submissions.length > 100) submissions = submissions.slice(0, 100);

    await context.env.REUBEN_DB.put("submissions", JSON.stringify(submissions));

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
