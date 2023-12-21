'use client';

import { CHAT_SESSIONS } from '../sample-data';
import { Button } from '@/components/ui/Button';
import ChatNavbar from '@/components/ui/ChatNavbar';
import { Textarea } from '@/components/ui/Textarea';
import React from 'react';
import { VscSend } from 'react-icons/vsc';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  const [currentMessage, setCurrentMessage] = React.useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };
  const [messages, setMessages] = React.useState<
    { message: string; side: 'left' | 'right' }[]
  >([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const onSend = (message: { message: string; side: 'left' | 'right' }) => {
    setMessages([...messages, message]);
    setCurrentMessage('');
  };
  const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend({ message: currentMessage, side: 'right' });
      setCurrentMessage('');
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <div className="w-full xl:max-w-3xl h-auto content-end grid grid-cols-1 px-4 gap-4 mx-auto ">
        {messages.map((message, index) => (
          <MessageItem side={message.side} key={index}>
            {message.message}
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* </div> */}
      <div className="w-full xl:max-w-3xl sticky bottom-0 shrink-0 mx-auto pb-4 bg-primary-foreground">
        <Textarea
          rows={1}
          className="max-h-[200px] text-lg"
          placeholder="What do you want?"
          value={currentMessage}
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onEnter(e)}
        />
        <Button
          variant={currentMessage !== '' ? 'default' : 'outline'}
          size="icon"
          disabled={currentMessage === ''}
          className={`absolute bottom-7 right-3`}
          onClick={() => onSend({ message: currentMessage, side: 'left' })}
        >
          <VscSend className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default PageDetail;

const MessageItem = ({
  side,
  children
}: {
  side: 'left' | 'right';
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${
        side === 'left'
          ? 'justify-self-start bg-background'
          : 'justify-self-end bg-accent'
      } max-w-[75%] rounded-2xl p-4 `}
    >
      {children}
    </div>
  );
};
