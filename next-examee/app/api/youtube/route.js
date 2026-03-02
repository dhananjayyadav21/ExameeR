import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const text = await request.text();
        if (!text) {
            return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
        }
        const body = JSON.parse(text);
        const { title, description, size, type } = body;

        // 1. Get Access Token using refresh token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.YOUTUBE_CLIENT_ID,
                client_secret: process.env.YOUTUBE_CLIENT_SECRET,
                refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('Token Error:', error);
            return NextResponse.json({ error: 'Failed to generate access token from refresh token' }, { status: 500 });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Initialize Resumable Upload
        const initResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Upload-Content-Length': size.toString(),
                'X-Upload-Content-Type': type || 'video/mp4',
                'Origin': request.headers.get('origin') || 'http://localhost:3000',
            },
            body: JSON.stringify({
                snippet: {
                    title: title || 'Uploaded Video',
                    description: description || 'Uploaded via Examee',
                    categoryId: '27'
                },
                status: {
                    privacyStatus: 'unlisted',
                    embeddable: true
                }
            })
        });

        if (!initResponse.ok) {
            const error = await initResponse.text();
            console.error('Upload Init Error:', error);
            return NextResponse.json({ error: 'Failed to initialize YouTube upload' }, { status: 500 });
        }

        const uploadUrl = initResponse.headers.get('Location') || initResponse.headers.get('location');
        if (!uploadUrl) {
            console.error('Missing Location Header:', Object.fromEntries(initResponse.headers.entries()));
            return NextResponse.json({ error: 'YouTube did not return a valid resumable upload URL. Try authenticating again.' }, { status: 500 });
        }

        return NextResponse.json({ uploadUrl });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
