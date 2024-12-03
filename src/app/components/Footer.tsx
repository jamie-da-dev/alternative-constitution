import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 ml-[500px] bg-gray-800 text-white py-4">
      <div className="flex justify-between items-center">
        {/* Admin email on the left */}
        <p className="text-sm">
          Email:{" "}
          <a
            href="mailto:admin@alternativeconstitution.nz"
            className="text-blue-400 hover:underline"
          >
            admin@alternativeconstitution.nz
          </a>
        </p>

        {/* Admin link on the right */}
        <p className="text-sm">
          <a href="/admin" className="text-white hover:underline">
            Admin
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
