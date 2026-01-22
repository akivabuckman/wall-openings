import React from "react";


const AerialView = ({ zoom = 1 }: { zoom?: number }) => (
  <section className="h-1/4 bg-zinc-900 rounded-b-lg shadow-inner flex flex-col items-center justify-center p-6 border-t border-zinc-800">
    <h3 className="text-zinc-100 text-base font-medium mb-2">Aerial View</h3>
    <div className="text-zinc-400 text-xs">Zoom: {zoom.toFixed(2)}x</div>
    {/* Aerial/top-down visualization will go here */}
  </section>
);

export default AerialView;
