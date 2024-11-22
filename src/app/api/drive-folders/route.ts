import { google } from 'googleapis'
import { NextResponse } from 'next/server'

const PARENT_FOLDER_ID = '1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI'

export async function GET() {
  try {
    console.log('1. Starting API request...')
    
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.log('2. Missing env variables!')
      return NextResponse.json({ 
        error: 'Configuration error', 
        details: 'Missing environment variables' 
      }, { status: 500 })
    }

    console.log('3. Creating auth...')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    console.log('4. Creating drive client...')
    const drive = google.drive({ version: 'v3', auth })

    try {
      console.log('5. Making drive.files.list request...')
      const response = await drive.files.list({
        q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
        orderBy: 'name',
      })

      console.log('6. Drive response:', response.data)

      if (!response.data.files) {
        console.log('7. No files found in response')
        return NextResponse.json({ 
          error: 'No files found', 
          details: 'The response did not contain any files' 
        }, { status: 404 })
      }

      const folders = response.data.files.map(file => ({
        id: file.id!,
        name: file.name!,
        folderId: file.id!,
      }))

      console.log('8. Processed folders:', folders)
      return NextResponse.json(folders)
    } catch (driveError: any) {
      console.error('Drive API Error:', driveError)
      return NextResponse.json({ 
        error: 'Drive API error', 
        details: driveError.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('General Error:', error)
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 })
  }
} 