'use server';

import { getSession } from '@/app/supabase-server';

const USE_CREDIT_BASE_URL = 'https://credit.fly.dev/api/core';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function queue(
  input: string,
  context: { role: 'user' | 'assistant'; content: string }[],
  sId?: string,
  isGettingTopic?: boolean
) {
  const authSession = await getSession();
  if (!authSession) {
    return;
  }
  const uId = authSession.user.id;
  const sessionId = sId ? sId : await createSession(uId);
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
          customer_ref: uId,
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
  return res.data;
};
