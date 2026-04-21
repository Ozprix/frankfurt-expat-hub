
import { useState, useEffect } from 'react';

export const usePasswordStrength = (password) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('Weak');
  const [color, setColor] = useState('bg-red-500');
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel('Weak');
      setColor('bg-gray-200');
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      return;
    }

    const reqs = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    setRequirements(reqs);

    const passedReqs = Object.values(reqs).filter(Boolean).length;
    
    // Calculate score (0-4)
    let score = 0;
    if (reqs.length) score++; // Base requirement
    if (reqs.uppercase && reqs.lowercase) score++;
    if (reqs.number) score++;
    if (reqs.special) score++;

    setStrength(score);

    switch (score) {
      case 0:
      case 1:
        setLabel('Weak');
        setColor('bg-red-500');
        break;
      case 2:
        setLabel('Fair');
        setColor('bg-yellow-500');
        break;
      case 3:
        setLabel('Good');
        setColor('bg-blue-500');
        break;
      case 4:
        setLabel('Strong');
        setColor('bg-green-500');
        break;
      default:
        setLabel('Weak');
        setColor('bg-red-500');
    }
  }, [password]);

  return { strength, label, color, requirements };
};
