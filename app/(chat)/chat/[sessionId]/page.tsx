'use client';

import { Request, useCreditSession } from '@/app/hooks/use-credit';
import { Message } from '@/components/ui/Chat';
import { ChatInput } from '@/components/ui/Chat/ChatInput/ChatInput';
import { queue as newQueue } from '@/server/Chat';
import { Metadata, ChatRequest } from '@/types';
import { getResponseContent } from '@/utils/chat';
import _ from 'lodash';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  // const [input, setInput] = React.useState<string>('');
  const sId = params.sessionId ? params.sessionId : undefined;
  const textboxRef = React.useRef<HTMLTextAreaElement>(null); //use to focus

  const { state, connected } = useCreditSession<Metadata>(sId);

  const context = React.useMemo(
    () =>
      state?.session.requests?.flatMap(
        (r) =>
          [
            { role: 'user', content: r.req_metadata?.input },
            { role: 'assistant', content: getResponseContent(r) }
          ] as const
      ) ?? [],
    [state]
  );

  const lastMessage = React.useMemo(
    () =>
      _(state?.active_requests ?? {})
        .toPairs()
        .map(([k, v]) => ({ ...v, id: k }))
        .value()
        .map((r) => getResponseContent(r))[0],
    [state]
  );

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
          {_.size(state?.active_requests) > 0 && (
            <Message role="assistant" content={lastMessage}>
              {lastMessage}
            </Message>
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
