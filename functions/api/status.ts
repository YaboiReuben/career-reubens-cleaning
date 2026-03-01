export const onRequestGet: PagesFunction = async (context) => {
  return new Response(JSON.stringify({ status: 'open' }), {
    headers: { "Content-Type": "application/json" },
  });
}
