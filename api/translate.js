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
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are a professional translator. Translate the following text from ${fromName} to ${toName}. Output only the translated text, nothing else.` },
          { role: 'user', content: text }
        ],
        temperature: 0.3
      })
    });
    const data = await resp.json();
    res.json({ text: data.choices[0].message.content.trim() });
  } catch (err) {
    res.json({ text: text });
  }
};
