const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, from, to } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  const fromLang = from || 'zh-TW';
  const toLang = to || 'en';
  const langMap = { 'zh-TW': 'Traditional Chinese', 'en': 'English' };
  const fromName = langMap[fromLang] || fromLang;
  const toName = langMap[toLang] || toLang;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        { role: 'system', content: `You are a professional translator. Translate the following text from ${fromName} to ${toName}. Output only the translated text, nothing else.` },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    });
    res.json({ text: response.choices[0].message.content.trim() });
  } catch (err) {
    res.json({ text: text });
  }
};
