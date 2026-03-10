'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface EditableFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  isFromAudit?: boolean;
}

export function EditableField({ label, value, onChange, isFromAudit }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value || '');
      setIsEditing(false);
    }
  };

  return (
    <div>
      <dt className="text-text-tertiary text-xs font-medium tracking-wide uppercase">{label}</dt>
      {isEditing ? (
        <div className="mt-1">
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            rows={1}
            className="border-accent-primary bg-bg-primary text-text-primary w-full resize-none rounded-lg border px-2.5 py-1.5 text-sm outline-none"
          />
        </div>
      ) : (
        <dd
          onClick={() => {
            setEditValue(value || '');
            setIsEditing(true);
          }}
          className={`group -mx-2.5 mt-1 flex cursor-pointer items-start gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5 ${
            value
              ? isFromAudit
                ? 'text-amber-300/90'
                : 'text-text-primary'
              : 'text-text-tertiary italic'
          }`}
        >
          <span className="flex-1 text-sm">{value || 'Not set yet'}</span>
          <PencilIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-50" />
        </dd>
      )}
    </div>
  );
}
