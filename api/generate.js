export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { skills, time, budget } = req.body;

  // Validate input
  if (!skills || !time || !budget) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are a teen money coach helping a 17-year-old earn money. Based on their profile, give 4 specific side hustle ideas they can START THIS WEEK.\nTheir skills: ${skills.join(", ")}.\nTime available: ${time}.\nStartup budget: ${budget}.\nFor each idea give: 1. Idea name 2. How to start in 3 steps 3. Realistic earning per week 4. One pro tip. Use emojis. Be specific and teen-friendly.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.message || 'API request failed' });
    }

    const data = await response.json();
    const ideas = data.content?.map(b => b.text || "").join("\n") || "";

    res.status(200).json({ ideas });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}