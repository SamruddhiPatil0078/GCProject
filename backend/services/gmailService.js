const { google } = require('googleapis');

// 🔥 Extract due date (IMPROVED)
const extractDueDate = (text) => {
  if (!text) return null;

  const match = text.match(/due\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}/i);
  if (!match) return null;

  const year = new Date().getFullYear();
  const date = new Date(match[0].replace(/due\s+/i, '') + ` ${year}`);

  return isNaN(date) ? null : date;
};

// 🔥 CLEAN TITLE (VERY IMPORTANT FIX)
const cleanTitle = (subject) => {
  if (!subject) return "Assignment";

  let title = subject
    .replace(/new assignment:?/gi, '')
    .replace(/notification settings/gi, '')
    .replace(/posted/gi, '')
    .replace(/see details/gi, '')
    .replace(/"/g, '')
    .replace(/\(.*?\)/g, '') // remove brackets
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Try extracting meaningful part
  const match = title.match(
    /(assignment\s*\d+|quiz|project|lab|dbms|java|marathi|object oriented programming)/i
  );

  return match ? match[0].toUpperCase() : title.slice(0, 60);
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
      q: 'from:classroom.google.com',
      maxResults: 50
    });

    const messages = res.data.messages || [];
    console.log(`📨 Found ${messages.length} classroom emails`);

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

      // 🔥 STRICT FILTER
      const isClassroom =
        from.toLowerCase().includes('classroom') &&
        (
          subject.toLowerCase().includes('assignment') ||
          subject.toLowerCase().includes('due') ||
          subject.toLowerCase().includes('posted')
        );

      if (!isClassroom) continue;

      // 🔥 CLEAN DATA
      const title = cleanTitle(subject);

      // 🔥 USE BOTH SUBJECT + DESCRIPTION FOR DATE
      const fullText = subject + " " + description;
      const deadline = extractDueDate(fullText);

      const category = detectCategory(title);
      const priority = calculatePriority(deadline);

      // 🔥 PDF DETECTION
      const hasPdf =
        msg.data.payload.parts?.some(
          part =>
            part.filename &&
            part.filename.toLowerCase().endsWith('.pdf')
        ) || false;

      console.log("📌", title, "| 📅", deadline, "| ⚡", priority);

      assignments.push({
        gmailId: message.id, // 🔥 KEY FOR DUPLICATE FIX
        title,
        description,
        deadline,
        category,
        priority,
        source: 'google_classroom',
        hasPdf,
        userId: user._id
      });
    }

    console.log(`✅ Returning ${assignments.length} assignments`);
    return assignments;

  } catch (error) {
    console.error('❌ Gmail Fetch Error:', error.message);
    return [];
  }
};

module.exports = { fetchAssignments };