import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { result: 'error', error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      console.error("GOOGLE_SCRIPT_URL is missing in environment variables.");
      return NextResponse.json(
        { result: 'error', error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('company', company || '');
    formData.append('message', message);

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.result === 'success') {
      return NextResponse.json({ result: 'success' }, { status: 200 });
    } else {
      console.error('Upstream error from Google Script:', data);
      return NextResponse.json(
        { result: 'error', error: 'Upstream error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error forwarding request:', error);
    return NextResponse.json(
      { result: 'error', error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
