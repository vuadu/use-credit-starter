'use server';

export const GPTSend = async (
  messages: { content: string; role: 'assistant' | 'user' }[]
) => {
  console.log('GPTSend', messages);

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const PROXY_API_KEY = process.env.PROXY_API_KEY || ''; // Provide a default empty string if the variable is not set
  if (!PROXY_API_KEY) {
    console.error('PROXY_API_KEY is not defined');
    return;
  }

  const PROXY_BASE_URL = process.env.PROXY_BASE_URL;
  if (!PROXY_BASE_URL) {
    console.error('PROXY_BASE_URL is not defined');
    return;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-USE-CREDIT-URL': 'https://api.openai.com/v1/chat/completions', // Target OpenAI endpoint
    'X-USE-CREDIT-API-KEY': PROXY_API_KEY,
    Authorization: `Bearer ${OPENAI_API_KEY}`
  };

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      ...messages
    ]
  };

  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/proxy`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return {
      success: true,
      data: message
    };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return {
      success: false,
      error
    };
  }
};
