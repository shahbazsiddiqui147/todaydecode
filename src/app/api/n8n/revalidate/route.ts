import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get('x-n8n-secret');
  return secret === process.env.N8N_INGEST_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: { slug?: string; categorySlug?: string } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  try {
    revalidatePath('/', 'page');
    revalidatePath('/sitemap.xml', 'page');

    if (body.slug) {
      revalidatePath(`/${body.slug}/`, 'page');
    }

    if (body.categorySlug) {
      revalidatePath(`/${body.categorySlug}/`, 'page');
    }

    return NextResponse.json({
      success: true,
      revalidated: {
        home: true,
        sitemap: true,
        slug: body.slug || null,
        categorySlug: body.categorySlug || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Revalidation failed.', detail: message },
      { status: 500 }
    );
  }
}
