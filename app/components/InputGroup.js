import { motion } from 'framer-motion';
import IconRemove from './icons/IconRemove';
export default function InputGroup({
  section,
  item,
  updateFormState,
  type,
  active,
}) {
  return (
    <motion.div
      className={`transition-all flex flex-col gap-2 w-full group ${
        active === 'selected' ? 'opacity-30' : ''
      }`}
      animate={
        active === 'dragging'
          ? {
              padding: '12px',
              border: '1px solid rgb(191 219 254)',
              backgroundColor: 'rgb(239 246 255)',
              cursor: 'grabbing',
            }
          : null
      }
      transition={{ ease: 'easeOut', duration: 0.1 }}
    >
      <div className='flex justify-between'>
        <label htmlFor={`${type}-${item.id}-name`}>NAME</label>
        <button
          type='button'
          className='group-hover:text-black/70 text-black/0 transition-all text-right'
          onClick={() =>
            updateFormState({ [type]: section.filter((i) => i.id != item.id) })
          }
        >
          REMOVE
        </button>
      </div>
      <input
        type='text'
        name='resume'
        id={`${type}-${item.id}-name`}
        className='border px-3 py-2 border-black bg-transparent'
        placeholder='Coursera Data Analytics'
        defaultValue={item?.name ? item.name : ''}
        onChange={(e) => {
          const updatedItems = section.map((i) =>
            i.id == item.id ? { ...i, name: e.target.value } : i
          );
          updateFormState({
            [type]: updatedItems,
          });
        }}
      />
      <label htmlFor={`${type}-${item.id}-year`}>DATE</label>
      <input
        type='text'
        name='resume'
        id={`${type}-${item.id}-year`}
        className='border px-3 py-2 border-black bg-transparent'
        placeholder='2024'
        defaultValue={item?.year ? item.year : ''}
        onChange={(e) => {
          const updatedItems = section.map((i) =>
            i.id === item.id ? { ...i, year: e.target.value } : i
          );
          updateFormState({
            [type]: updatedItems,
          });
        }}
      />
    </motion.div>
  );
}
