'use server';

import { getSession } from '@/app/supabase-server';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const CUSTOMER_REF_COOKIE = 'customer-ref';
const SESSION_ID_COOKIE = 'session-id';
const USE_CREDIT_BASE_URL = 'https://credit.fly.dev/api/core';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const GPTSend = async (
  messages: { content: string; role: 'assistant' | 'user' }[]
) => {
  console.log('GPTSend', messages);

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

function getCustomerRef() {
  const cookieStore = cookies();

  let customerRef = cookieStore.get(CUSTOMER_REF_COOKIE)?.value;
  if (!customerRef) {
    customerRef = randomUUID();
    cookieStore.set(CUSTOMER_REF_COOKIE, customerRef);
  }
  return customerRef;
}

export async function getOrCreateSession() {
  'use server';
  const cookieStore = cookies();

  let sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value;
  if (!sessionId) {
    const res = await fetch(`${USE_CREDIT_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'x-use-credit-api-key': process.env.USE_CREDIT_SECRET ?? '',
        'content-type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          attributes: {
            customer_ref: getCustomerRef()
          }
        }
      })
    })
      .then((res) => res.text())
      .then((body) => {
        console.log(body);
        return JSON.parse(body);
      });
    console.log(res);
    sessionId = res.data.id;
    if (sessionId) {
      cookieStore.set(SESSION_ID_COOKIE, sessionId);
    }
  }
  return sessionId;
}

export async function queue(
  input: string,
  context: { role: 'user' | 'assistant'; content: string }[],
  sId?: string,
  isGettingTopic?: boolean
) {
  const customerRef = getCustomerRef();
  const authSession = await getSession();
  if (!authSession) {
    return;
  }
  const uId = authSession.user.id;
  const sessionId = sId ? sId : await createSession(uId);
  console.log('context length', context.length);
  const isTopic = isGettingTopic ? isGettingTopic : false;

  const res = await fetch(`${USE_CREDIT_BASE_URL}/requests`, {
    method: 'POST',
    headers: {
      'x-use-credit-api-key': process.env.USE_CREDIT_SECRET ?? '',
      'content-type': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        attributes: {
          customer_ref: customerRef,
          session_id: sessionId,
          req_url: 'https://api.openai.com/v1/chat/completions',
          // req_url: "http://localhost:11434/api/chat",
          req_body: {
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [...context, { role: 'user', content: input }]
          },
          req_method: 'post',
          req_headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${OPENAI_API_KEY}`
          },
          req_metadata: { input, isGettingTopic: isTopic }
        }
      }
    })
  })
    .then((res) => res.text())
    .then((body) => {
      // console.log('queue', body);
      return JSON.parse(body);
    });
  return res.data?.id;
}

export const getSessions = async () => {
  const authSession = await getSession();
  if (!authSession) {
    return;
  }
  const uId = authSession.user.id;
  if (!process.env.USE_CREDIT_SECRET) {
    console.error('USE_CREDIT_SECRET is not defined');
    return;
  }

  const res = await fetch(
    `${USE_CREDIT_BASE_URL}/sessions?customer_ref=${uId}`,
    {
      headers: {
        'x-use-credit-api-key': process.env.USE_CREDIT_SECRET ?? '',
        'content-type': 'application/vnd.api+json'
      }
    }
  )
    .then((res) => res.text())
    .then((body) => {
      return JSON.parse(body);
    });

  return res.data;
};

export const createSession = async (userId: string) => {
  if (!process.env.USE_CREDIT_SECRET) {
    console.error('USE_CREDIT_SECRET is not defined');
    return;
  }

  const res = await fetch(`${USE_CREDIT_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'x-use-credit-api-key': process.env.USE_CREDIT_SECRET ?? '',
      'content-type': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        attributes: {
          customer_ref: userId
        }
      }
    })
  })
    .then((res) => res.text())
    .then((body) => {
      return JSON.parse(body);
    });
  console.log('new session', res);
  const sessionId = res.data.id;

  return res.data;
};

export const updateSessionName = async (sessionId: string, name: string) => {
  if (!process.env.USE_CREDIT_SECRET) {
    console.error('USE_CREDIT_SECRET is not defined');
    return;
  }

  const res = await fetch(`${USE_CREDIT_BASE_URL}/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'x-use-credit-api-key': process.env.USE_CREDIT_SECRET ?? '',
      'content-type': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        attributes: {
          name
        }
      }
    })
  })
    .then((res) => res.text())
    .then((body) => {
      return JSON.parse(body);
    });
  console.log('update session', res);
  return res.data;
};
