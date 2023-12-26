'use server';

import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const CUSTOMER_REF_COOKIE = 'customer-ref';
const SESSION_ID_COOKIE = 'session-id';

// const USE_CREDIT_BASE_URL = "http://localhost:4000/api/core";
const USE_CREDIT_BASE_URL = 'https://credit.fly.dev/api/core';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
  sId?: string
) {
  console.log('input data', input);
  const customerRef = getCustomerRef();
  const sessionId = await getOrCreateSession();
  console.log('sessionId', sessionId);
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
          req_metadata: { input }
        }
      }
    })
  })
    .then((res) => res.text())
    .then((body) => {
      console.log(body);
      return JSON.parse(body);
    });
  return res.data?.id;
}
