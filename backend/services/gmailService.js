const { google } = require('googleapis');

// 🔥 Extract due date
const extractDueDate = (text) => {
  if (!text) return null;

  const match = text.match(/Due\s+([A-Za-z]{3,})\s+(\d{1,2})/i);
  if (!match) return null;

  const year = new Date().getFullYear();
  const date = new Date(`${match[1]} ${match[2]}, ${year}`);

  return isNaN(date) ? null : date;
};

// 🔥 Detect category
const detectCategory = (title) => {
  if (!title) return "GENERAL";

  const t = title.toLowerCase();

  if (t.includes('dbms')) return "DBMS";
  if (t.includes('java')) return "JAVA";
  if (t.includes('marathi')) return "MARATHI";
  if (t.includes('object oriented')) return "OOP";

  return "GENERAL";
};

// 🔥 Priority logic
const calculatePriority = (deadline) => {
  if (!deadline) return "LOW";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);

  const days = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

  if (days < 0) return "OVERDUE";
  if (days <= 3) return "HIGH";
  if (days <= 10) return "MEDIUM";
  return "LOW";
};

// 🚀 MAIN FUNCTION
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
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'classroom assignment OR due OR posted',
      maxResults: 50
    });

    const messages = res.data.messages || [];
    const assignments = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });

      const headers = msg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';

      // 🔥 Extract body
      let body = '';
      if (msg.data.payload.parts) {
        const textPart = msg.data.payload.parts.find(part =>
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );

        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      } else if (msg.data.payload.body?.data) {
        body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8');
      }

      const description = body || msg.data.snippet || '';

      // 🔍 Detect assignment email
      const isClassroom =
        from.includes('google') || from.includes('classroom');

      const hasKeyword =
        subject.toLowerCase().includes('assignment') ||
        subject.toLowerCase().includes('due') ||
        description.toLowerCase().includes('assignment');

      if (!(isClassroom && hasKeyword)) continue;

      // 📄 PDF check
      const hasPdf = msg.data.payload.parts?.some(part =>
        part.filename?.toLowerCase().endsWith('.pdf')
      ) || false;

      // 🔥 Clean title
      let cleanTitle = subject
        .toLowerCase()
        .replace(/new assignment:/g, '')
        .replace(/posted/g, '')
        .replace(/"/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanTitle) continue;

      // 🔥 Your smart logic
      const deadline = extractDueDate(description);
      const category = detectCategory(cleanTitle);
      const priority = calculatePriority(deadline);

      assignments.push({
        gmailId: message.id,
        title: cleanTitle,
        description,
        deadline,
        category,
        priority,
        hasPdf,
        userId: user._id
      });
    }

    console.log(`Returning ${assignments.length} assignments`);
    return assignments;

  } catch (error) {
    console.error('Error fetching Gmail:', error);
    return [];
  }
};

module.exports = { fetchAssignments };