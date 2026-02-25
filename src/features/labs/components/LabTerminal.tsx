import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';

export const LabTerminal: React.FC<{ labId: string }> = ({ labId }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<string[]>([
    'Welcome to CyberLabs Terminal v1.0',
    'Type "help" to see available commands.',
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const newCmd = `$ ${input}`;
      // TODO: إرسال الأمر عبر WebSocket الآمن إلى الـ Backend
      const response =
        input === 'help'
          ? 'Available commands: ls, cat, echo'
          : `bash: ${input}: command not found`;
      setHistory((prev) => [...prev, newCmd, response]);
      setInput('');
    }
  };

  return (
    <div className='flex flex-col h-full bg-black text-green-400 font-mono text-sm p-2 rounded-md border border-gray-800'>
      <ScrollArea className='flex-1 w-full'>
        {history.map((line, idx) => (
          <div key={idx} className='whitespace-pre-wrap break-words'>
            {line}
          </div>
        ))}
      </ScrollArea>
      <div className='flex items-center mt-2 border-t border-gray-800 pt-2'>
        <span className='me-2 text-blue-400'>user@cyberlabs:~$</span>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className='flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0'
          autoFocus
          dir='ltr'
        />
      </div>
    </div>
  );
};
