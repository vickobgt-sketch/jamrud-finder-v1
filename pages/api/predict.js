export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req) {
  try {
    const body = await req.formData();
    // Get file but ignore content (dummy mode)
    const file = body.get('file');

    // Dummy random score
    const score = Math.random();

    return new Response(
      JSON.stringify({
        success: true,
        fileName: file?.name || "unknown",
        model: "dummy-mini-model",
        score,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.toString() }),
      { status: 500 }
    );
  }
}

