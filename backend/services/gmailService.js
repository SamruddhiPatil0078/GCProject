const { google } = require('googleapis');

const fetchAssignments = async (user) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    // Search specifically for Google Classroom emails
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:no-reply@classroom.google.com OR (classroom.google.com AND (assignment OR posted OR due))',
      maxResults: 50
    });

    const messages = res.data.messages || [];
    console.log(`Found ${messages.length} Google Classroom emails`);

    const assignments = [];
    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full' // Get full message including attachments info
      });

      const headers = msg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      
      // Get message body (text content)
      let body = '';
      if (msg.data.payload.parts) {
        // Multipart message
        const textPart = msg.data.payload.parts.find(part => 
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart && textPart.body && textPart.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      } else if (msg.data.payload.body && msg.data.payload.body.data) {
        // Simple message
        body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8');
      }

      // Use snippet as fallback
      const description = body || msg.data.snippet || '';

      console.log(`Checking Classroom email: ${subject} | From: ${from}`);

      // Check if it's a Classroom assignment email
      const isFromClassroom = from.includes('google.com') || from.includes('classroom');
      const hasAssignmentKeyword = subject.toLowerCase().includes('assignment') || 
                                   subject.toLowerCase().includes('posted') || 
                                   subject.toLowerCase().includes('due') ||
                                   description.toLowerCase().includes('assignment');

      console.log(`From Classroom: ${isFromClassroom}, Has keyword: ${hasAssignmentKeyword}, Subject: "${subject}"`);

      // For now, let's accept any email that has assignment in subject
      const isClassroomAssignment = hasAssignmentKeyword;

      // Check for PDF attachments
      const hasPdfAttachment = msg.data.payload.parts?.some(part => 
        part.filename && part.filename.toLowerCase().endsWith('.pdf')
      ) || false;

      if (isClassroomAssignment) {
        console.log(`Found Classroom assignment: ${subject} (PDF: ${hasPdfAttachment})`);
        assignments.push({
          title: subject,
          description: description,
          source: 'google_classroom',
          hasPdf: hasPdfAttachment,
          userId: user._id
        });
      }
    }

    console.log(`Returning ${assignments.length} Classroom assignments`);
    return assignments;
  } catch (error) {
    console.error('Error fetching Gmail:', error);
    return [];
  }
};

module.exports = { fetchAssignments };