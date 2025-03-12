import React from 'react';
import { Icon } from '@iconify/react';

interface EmptyPlaceholderProps {
  message: string;
}

const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-md">
      <Icon icon="material-symbols:event-busy-outline" className="text-6xl text-gray-400" />
      <p className="text-xl text-gray-500 mt-4">{message}</p>
    </div>
  );
};

export default EmptyPlaceholder;
