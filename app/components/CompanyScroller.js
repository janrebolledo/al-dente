import React from 'react';
import IconApple from './icons/companies/IconApple';
import IconGoogle from './icons/companies/IconGoogle';
import IconX from './icons/companies/IconX';
import IconRoblox from './icons/companies/IconRoblox';

export default function CompanyScroller({ className }) {
  const companies = [<IconApple />, <IconGoogle />, <IconX />, <IconRoblox />];

  return (
    <div className={`flex overflow-hidden scroller-wrapper w-40 ${className}`}>
      <div className='scroller flex gap-8 pr-8'>
        {companies.map((i) => (
          <p key={i}>{i}</p>
        ))}
      </div>
      <div className='scroller flex gap-8 pr-8'>
        {companies.map((i) => (
          <p key={i}>{i}</p>
        ))}
      </div>
    </div>
  );
}
