import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folderId = searchParams.get('folderId')

  if (!folderId) {
    return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
  }

  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing environment variables')
      return NextResponse.json({ 
        error: 'Configuration error', 
        details: 'Missing environment variables' 
      }, { status: 500 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    const drive = google.drive({ version: 'v3', auth })

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType, webViewLink)',
      orderBy: 'name',
      pageSize: 1000 // Get up to 1000 items
    })

    if (!response.data.files) {
      return NextResponse.json({ error: 'No files found' }, { status: 404 })
    }

    const items = response.data.files.map(file => ({
      id: file.id!,
      name: file.name!,
      type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
      mimeType: file.mimeType!,
      webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
    }))

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 })
  }
}
