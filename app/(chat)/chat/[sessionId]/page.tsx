'use client';

import { Request, useCreditSession } from '@/app/hooks/use-credit';
import { ChatInput } from '@/components/ui/Chat/ChatInput/ChatInput';
import { Metadata, ChatRequest } from '@/types';
import { getOrCreateSession, queue } from '@/utils/actions';
import { getResponseContent } from '@/utils/chat';
import _ from 'lodash';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  const [input, setInput] = React.useState<string>('');
  const [sessionId, setSessionId] = React.useState<string | undefined>();
  React.useEffect(() => {
    getOrCreateSession().then(setSessionId);
  }, []);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const textboxRef = React.useRef<HTMLTextAreaElement>(null); //use for focus

  const { state, connected } = useCreditSession<Metadata>(sessionId);

  const context = React.useMemo(
    () =>
      state?.session.requests?.flatMap(
        (r) =>
          [
            { role: 'user', content: r.req_metadata.input },
            { role: 'assistant', content: getResponseContent(r) }
          ] as const
      ) ?? [],
    [state]
  );

  const lastestMessage = React.useMemo(
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
      queue(input, context).then((res) => {
        console.log('queue res: ', res);
      });
    },
    [input, context]
  );

  return (
    <>
      <ScrollToBottom className="w-full h-full overflow-auto py-4">
        <div className="w-full xl:max-w-3xl h-auto content-end grid grid-cols-1 px-4 gap-4 mx-auto ">
          {context.map((message, index) => (
            <MessageItem role={message.role} key={index}>
              {message.content}
            </MessageItem>
          ))}
          {_.size(state?.active_requests) > 0 && (
            <MessageItem role="assistant">{lastestMessage}</MessageItem>
          )}

          <div ref={messagesEndRef} />
        </div>
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

const MessageItem = ({
  role,
  children
}: {
  role: 'assistant' | 'user';
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${
        role === 'assistant'
          ? 'justify-self-start bg-background'
          : 'justify-self-end bg-accent'
      } max-w-[75%] rounded-2xl p-4 `}
    >
      {children}
    </div>
  );
};
