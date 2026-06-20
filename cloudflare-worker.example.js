export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Metodo nao permitido." }, 405, corsHeaders);
    }

    if (!env.NVIDIA_API_KEY) {
      return json({ error: "NVIDIA_API_KEY nao configurada no Worker." }, 500, corsHeaders);
    }

    const body = await request.json();
    const nvidiaResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const text = await nvidiaResponse.text();

    return new Response(text, {
      status: nvidiaResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": nvidiaResponse.headers.get("Content-Type") || "application/json",
      },
    });
  },
};

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}
