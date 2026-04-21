import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => (
  <section className="bg-[#0f172a] px-4 py-14 text-white sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5eead4]">Ready for Frankfurt</p>
        <h2 className="mt-2 text-3xl font-black">Build your relocation plan today.</h2>
      </div>
      <Link
        to="/signup"
        className="inline-flex items-center justify-center rounded-lg bg-[#14b8a6] px-5 py-3 text-sm font-bold text-[#042f2e] transition hover:bg-[#2dd4bf]"
      >
        Start planning
      </Link>
    </div>
  </section>
);

export default CallToAction;
