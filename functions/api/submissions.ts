interface Env {
  REUBEN_DB: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const value = await context.env.REUBEN_DB.get("submissions");
    const submissions = value ? JSON.parse(value) : [];
    
    return new Response(JSON.stringify(submissions), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
