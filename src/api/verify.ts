export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ valid: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { licenseKey } = await req.json();

  if (!licenseKey) {
    return new Response(JSON.stringify({ valid: false, error: 'ライセンスキーを入力してください。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: 'Thumbly Browser',
      }),
    });

    const data = await res.json();

    if (data.valid && data.meta?.product_id === 922324) {
      return new Response(JSON.stringify({ valid: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(
        JSON.stringify({ valid: false, error: 'ライセンスキーが無効です。購入内容を確認してください。' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: '認証サーバーへの接続に失敗しました。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
