const { google } = require('googleapis');

// 🔥 Extract due date
const extractDueDate = (text) => {
  if (!text) return null;

  const match = text.match(/Due\s+([A-Za-z]{3,})\s+(\d{1,2})/i);
  if (!match) return null;

  const month = match[1];
  const day = match[2];

  const year = new Date().getFullYear();
  const date = new Date(`${month} ${day}, ${year}`);

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

// 🔥 FIXED priority logic (IMPORTANT)
const calculatePriority = (deadline) => {
  if (!deadline) return "LOW";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);

  const diffTime = d - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log("📊 Days left:", days);

  if (days < 0) return "OVERDUE";
  if (days <= 3) return "HIGH";      // 🔥 changed
  if (days <= 10) return "MEDIUM";   // 🔥 changed
  return "LOW";
};

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
        format: 'full'
      });

      const headers = msg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';

      const description = msg.data.snippet || '';

      const isFromClassroom =
        from?.includes('google.com') || from?.includes('classroom');

      const hasAssignmentKeyword =
        subject.toLowerCase().includes('assignment') ||
        subject.toLowerCase().includes('posted') ||
        subject.toLowerCase().includes('due');

      const isClassroomAssignment =
        isFromClassroom && hasAssignmentKeyword;

      const hasPdfAttachment =
        msg.data.payload.parts?.some(
          part =>
            part.filename &&
            part.filename.toLowerCase().endsWith('.pdf')
        ) || false;

      if (isClassroomAssignment) {

        // 🔥 CLEAN TITLE
        let cleanTitle = subject
          .toLowerCase()
          .replace(/new assignment:/g, '')
          .replace(/posted/g, '')
          .replace(/"/g, '')
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (!cleanTitle) continue;

        // 🔥 CORE LOGIC
        const deadline = extractDueDate(description);
        const category = detectCategory(cleanTitle);
        const priority = calculatePriority(deadline);

        console.log("📅 Deadline:", deadline);
        console.log("📚 Category:", category, "| ⚡ Priority:", priority);

        assignments.push({
          gmailId: message.id,
          title: cleanTitle,
          description,
          deadline,
          category,
          priority,
          source: 'google_classroom',
          hasPdf: hasPdfAttachment,
          userId: user._id
        });
      }
    }

    console.log(`Returning ${assignments.length} assignments`);
    return assignments;

  } catch (error) {
    console.error('Error fetching Gmail:', error);
    return [];
  }
};

module.exports = { fetchAssignments };