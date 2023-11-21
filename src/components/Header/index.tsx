'use client';
import React from 'react';
import Navigation from '../Navigation';
import Logo from '../Logo';
import SelectLanguage from '../SelectLanguage';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function Header({ className, children }: Props) {
  const headerClass = className || 'header';

  return (
    <header className={headerClass}>
      <Logo link={`/`} />
      <Navigation />
      {children}
      <div className='lang'>
        <SelectLanguage />
      </div>
    </header>
  );
}
