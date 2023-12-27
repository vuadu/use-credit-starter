import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import React from 'react';
import { VscSend } from 'react-icons/vsc';

interface ChatInputProps {
  onSend: (message: { content: string; role: 'assistant' | 'user' }) => void;
  isAsking: boolean;
  textboxRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ ...props }, ref) => {
    const [currentMessage, setCurrentMessage] = React.useState<string>('');
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentMessage(e.target.value);
    };

    const messageSend = () => {
      props.onSend({ content: currentMessage, role: 'user' });
      setCurrentMessage('');
    };
    const onEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        messageSend();
      }
    };
    return (
      <div className="w-full px-4 xl:max-w-3xl shrink-0 mx-auto pb-4 bg-primary-foreground relative">
        <Textarea
          ref={props.textboxRef}
          rows={1}
          className="max-h-[200px] text-lg pl-3 pr-12"
          placeholder="What do you want?"
          value={currentMessage}
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onEnter(e)}
          disabled={props.isAsking}
        />
        <Button
          variant={currentMessage !== '' ? 'default' : 'outline'}
          size="icon"
          disabled={currentMessage === ''}
          className={`absolute bottom-7 right-7`}
          onClick={() => messageSend()}
        >
          <VscSend className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

// export default ChatInput;
