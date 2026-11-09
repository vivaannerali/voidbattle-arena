export default async function (req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const body = await req.json().catch(() => ({}));
    const apiKey = typeof body?.apiKey === 'string' ? body.apiKey.trim() : '';
    if (!/^[A-Za-z0-9_-]{8,120}$/.test(apiKey)) {
      return Response.json({ error: 'That does not look like a pixeldrain API key.' }, { status: 400 });
    }

    const res = await fetch('https://pixeldrain.com/api/user/files', {
      headers: { Authorization: 'Basic ' + btoa(':' + apiKey) },
      signal: AbortSignal.timeout(12000),
    });

    if (res.status === 401 || res.status === 403) {
      return Response.json({ error: 'pixeldrain rejected that API key.' }, { status: 401 });
    }
    if (!res.ok) {
      return Response.json({ error: 'pixeldrain did not return the file list.' }, { status: 502 });
    }

    const data = await res.json().catch(() => null);
    const list = Array.isArray(data?.files) ? data.files : Array.isArray(data) ? data : [];

    const files = list
      .filter((file: any) => file && typeof file.id === 'string')
      .sort((a: any, b: any) => String(b.date_created || '').localeCompare(String(a.date_created || '')))
      .slice(0, 40)
      .map((file: any) => ({
        id: file.id,
        name: String(file.name || 'Untitled').slice(0, 120),
        size: Number(file.size) || 0,
        created: String(file.date_created || ''),
      }));

    return Response.json({ files });
  } catch (error) {
    return Response.json({ error: error?.message || 'pixeldrain request failed' }, { status: 500 });
  }
}