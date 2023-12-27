'use client';

import { ChatContext } from '@/app/context/ChatContext';
import { Request, useCreditSession } from '@/app/hooks/use-credit';
import { Message } from '@/components/ui/Chat';
import { ChatInput } from '@/components/ui/Chat/ChatInput/ChatInput';
import { queue as newQueue } from '@/server/Chat';
import { Metadata, ChatRequest } from '@/types';
import { getResponseContent } from '@/utils/chat';
import _ from 'lodash';
import React, { useEffect, useContext, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  // const [input, setInput] = React.useState<string>('');
  const sId = params.sessionId ? params.sessionId : undefined;
  const textboxRef = React.useRef<HTMLTextAreaElement>(null); //use to focus
  const { updateSessionName, getSessionName } = useContext(ChatContext);
  const { state, connected } = useCreditSession<Metadata>(sId);
  const [context, setContext] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  useEffect(() => {
    let newRequests: ChatRequest[] = [];
    if (state?.session.requests) {
      state.session.requests.forEach((r) => {
        if (r.req_metadata?.isGettingTopic === true) {
          if (r.status === 'finished') {
            updateSessionName(sId as string, getResponseContent(r));
          }
        } else newRequests = [...newRequests, r];
      });
    }

    if (state?.active_requests) {
      _(state.active_requests)
        .toPairs()
        .forEach(([k, v]) => {
          const idx = newRequests.findIndex((nr) => nr.id === k);
          if (idx !== -1) {
            newRequests[idx] = { ...newRequests[idx], ...v };
          }
        });
    }
    const newContext =
      newRequests.flatMap((r) => {
        return [
          { role: 'user', content: r.req_metadata?.input },
          {
            role: 'assistant',
            content: getResponseContent(r)
          }
        ] as const;
      }) ?? [];

    setContext(newContext);
    if (_.size(state?.active_requests) === 0) {
      textboxRef.current?.focus();
    }
  }, [state]);

  useEffect(() => {
    if (
      _.size(state?.session.requests) === 1 &&
      getSessionName(sId as string) === null &&
      state?.session.requests[0].status === 'finished'
    ) {
      const topicPrompt = `Generate name based on the first 2 messages in this conversation. The topic is maximized to 7 words.`;
      newQueue(topicPrompt, context, sId, true);
    }
  }, [state]);

  const onSend = React.useCallback(
    (message: { content: string; role: 'assistant' | 'user' }) => {
      const input = message.content;
      newQueue(input, context, sId).then((res) => {
        textboxRef.current?.focus();
      });
    },
    [context]
  );

  return (
    <>
      <ScrollToBottom className="w-full h-full overflow-auto">
        <div className="w-full xl:max-w-3xl h-auto content-end grid grid-cols-1 px-4 gap-4 mx-auto ">
          {context.map(
            (message, index) =>
              message.content !== '' && (
                <Message
                  role={message.role}
                  key={index}
                  content={message.content}
                >
                  {message.content}
                </Message>
              )
          )}
        </div>
        <div className="h-8" />
      </ScrollToBottom>

      <ChatInput
        onSend={onSend}
        isAsking={_.size(state?.active_requests) > 0}
        textboxRef={textboxRef}
      />
    </>
  );
};

export default PageDetail;
