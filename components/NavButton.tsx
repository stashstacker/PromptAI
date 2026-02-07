import React from 'react';

interface NavButtonProps {
    page: string;
    currentPage: string;
    onClick: (page: string) => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ page, currentPage, onClick, children, icon }) => (
    <button
        onClick={() => onClick(page)}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === page 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon && <span className="w-5 h-5">{icon}</span>}
        <span className="hidden sm:inline">{children}</span>
    </button>
);

export default NavButton;
