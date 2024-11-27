import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconDragHandle from '../icons/IconDragHandle';

export default function SortableItem({ children, id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        transform ? 'p-3 border border-blue-200 bg-blue-50' : ''
      } transition-[background-color,border,padding,gap] mb-6 flex hover:gap-4 group`}
    >
      <button
        {...listeners}
        {...attributes}
        type='button'
        className={`${
          transform ? 'cursor-grabbing' : 'cursor-grab'
        } w-0 group-hover:w-6 transition-all overflow-hidden`}
      >
        <IconDragHandle />
      </button>
      {children}
    </div>
  );
}
