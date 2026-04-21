import React from 'react';

const WelcomeMessage = ({ name = 'there' }) => (
  <div className="rounded-lg border border-[#dbe1d8] bg-white p-5">
    <p className="text-sm font-semibold text-[#475569]">Welcome, {name}.</p>
    <p className="mt-2 text-sm text-[#64748b]">
      Your Frankfurt relocation workspace is ready when you are.
    </p>
  </div>
);

export default WelcomeMessage;
