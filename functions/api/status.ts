interface Env {
  REUBEN_DB: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const value = await context.env.REUBEN_DB.get("appStatus");
    return new Response(JSON.stringify({ status: value || 'open' }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: 'open' }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { status } = await context.request.json() as { status: string };
    
    if (['open', 'closing-soon', 'closed'].includes(status)) {
      await context.env.REUBEN_DB.put("appStatus", status);
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
