import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] text-white text-sm py-6 mt-12 shadow-inner">
      <div className="max-w-4xl mx-auto text-center">
        <p className="mb-2 text-[#27dec0] font-semibold">NotesVault</p>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
