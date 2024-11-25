'use client'

import { useState } from 'react';

export function Footer() {
  const email = "openu.ba.acc@gmail.com";
  const [showToast, setShowToast] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000); // Hide after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <footer className="mt-auto py-6 text-center text-sm text-gray-500 border-t relative">
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md text-sm animate-fade-out">
          הועתק!
        </div>
      )}
      <div className="container mx-auto px-4">
        לפניות הקשורות לאתר או לתוכנו ניתן לפנות למייל:
        <a 
          href="mailto:openu.ba.acc@gmail.com" 
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard();
          }}
          className="hover:text-gray-800 transition-colors mx-1 cursor-pointer"
        >
          {email}
        </a>
      </div>
    </footer>
  )
} 