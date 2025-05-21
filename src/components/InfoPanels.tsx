import React from 'react';

const InfoPanels: React.FC = () => {
  return (
    <div className="info-panels p-4 bg-white text-black space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Raymond's World</h1>
      <p>
        This site combines a side‑scrolling platformer with traditional
        web content. Scroll to keep the character on screen while reading
        about Raymond and his projects.
      </p>
      <p className="italic">More interactive sections are coming soon!</p>
    </div>
  );
};

export default InfoPanels;
