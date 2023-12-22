'use client';

import { CHAT_SESSIONS } from '../sample-data';
import { Button } from '@/components/ui/Button';
import ChatNavbar from '@/components/ui/ChatNavbar';
import LoadingDots from '@/components/ui/LoadingDots';
import { Textarea } from '@/components/ui/Textarea';
import { GPTSend } from '@/server/Chat';
import React from 'react';
import { VscSend } from 'react-icons/vsc';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  const [currentMessage, setCurrentMessage] = React.useState<string>('');
  const [isAsking, setIsAsking] = React.useState<boolean>(false);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };
  const [messages, setMessages] = React.useState<
    { content: string; role: 'assistant' | 'user' }[]
  >([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const textboxRef = React.useRef<HTMLTextAreaElement>(null); //use for focus

  const onSend = (message: { content: string; role: 'assistant' | 'user' }) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollToBottom();
    setCurrentMessage('');
    setIsAsking(true);
  };
  const onEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend({ content: currentMessage, role: 'user' });
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
    textboxRef.current?.focus();
  }, [messages]);

  React.useEffect(() => {
    if (isAsking) {
      try {
        (async () => {
          const res = await GPTSend(messages);
          if (res && res.success) {
            setMessages([
              ...messages,
              { content: res.data, role: 'assistant' }
            ]);
            setIsAsking(false);
            setCurrentMessage('');
          }
        })();
      } catch (err) {
        console.log(err);
        setIsAsking(false);
      }
    }
  }, [isAsking]);

  return (
    <>
      <div className="w-full h-full overflow-auto py-4">
        <div className="w-full xl:max-w-3xl h-auto content-end grid grid-cols-1 px-4 gap-4 mx-auto ">
          {messages.map((message, index) => (
            <MessageItem role={message.role} key={index}>
              {message.content}
            </MessageItem>
          ))}
          {isAsking && (
            <MessageItem role="assistant">
              <LoadingDots />
            </MessageItem>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* </div> */}
      <div className="w-full px-4 xl:max-w-3xl relative shrink-0 mx-auto pb-4 bg-primary-foreground">
        <Textarea
          ref={textboxRef}
          rows={1}
          className="max-h-[200px] text-lg pl-3 pr-12"
          placeholder="What do you want?"
          value={currentMessage}
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onEnter(e)}
          disabled={isAsking}
          autoFocus
        />
        <Button
          variant={currentMessage !== '' ? 'default' : 'outline'}
          size="icon"
          disabled={currentMessage === ''}
          className={`absolute bottom-7 right-7`}
          onClick={() => onSend({ content: currentMessage, role: 'user' })}
        >
          <VscSend className="h-4 w-4" />
        </Button>
      </div>
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
