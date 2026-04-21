import React from 'react';

const URL_PATTERN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

const LinkifiedUserContent = ({ text, className = '' }) => {
  const value = String(text || '');
  const parts = value.split(URL_PATTERN);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        if (!part.match(URL_PATTERN)) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

        const href = part.startsWith('http') ? part : `https://${part}`;
        return (
          <a
            key={`${part}-${index}`}
            href={href}
            target="_blank"
            rel="ugc nofollow noopener noreferrer"
            className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-900"
          >
            {part}
          </a>
        );
      })}
    </p>
  );
};

export default LinkifiedUserContent;
