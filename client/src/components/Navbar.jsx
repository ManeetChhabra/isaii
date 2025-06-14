import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#1f2937] text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-[#27dec0]">
        NotesVault
      </Link>
      <div className="space-x-6 text-sm md:text-base">
        <Link to="/notes" className="hover:text-[#27dec0] transition">Notes</Link>
        <Link to="/login" className="hover:text-[#27dec0] transition">Login</Link>
        <Link to="/register" className="hover:text-[#27dec0] transition">Register</Link>
      </div>
    </nav>
  );
}
