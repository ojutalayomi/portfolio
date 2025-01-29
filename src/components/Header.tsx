'use client'
import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from "next/image";

const Header = () => {
    const location = useParams();
    // Add state for mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const list = [
        { label: 'Home', path: '#' },
        { label: 'Stack', path: '#stack' },
        { label: 'Projects', path: '#projects' },
        { label: 'About', path: '#about' },
        { label: 'News', path: '#news' },
        { label: 'Contact', path: '#contact' }
    ]

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <header className={`backdrop-blur-lg border-b-[1px] p-2 sticky top-0 z-50 shadow-xl lg:shadow-none overflow-auto
            transform origin-top transition-all duration-500 ease-in-out md:h-auto 
            ${isMenuOpen ? 'translate-y-0 h-[400px]' : 'h-[53.5px] md:translate-y-0'}`}
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-auto flex justify-between items-center">
                    <Image src="/default-logo1.svg" className="pb-1 aspect-square md:size-12" width={33} height={33} alt=''/>
                    {/* Hamburger Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />
                        <button 
                        className="p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                        </button>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className={`w-full md:w-auto md:h-auto`}>
                    <ul className={`flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center
                        transform origin-top transition-transform duration-500 ease-in-out md:h-auto
                        ${isMenuOpen ? 'h-auto translate-y-0 opacity-100' : 'h-0 -translate-y-4 opacity-0 md:translate-y-0 md:opacity-100'}`}
                    >
                        {list.map((item, index) => (
                            <li key={index}>
                                <Link href={item.path} 
                                className={`text-lg block py-2 md:py-0 transition-colors duration-200 drop-shadow-2xl  ${location?.path === item.path ? 'text-accent' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsMenuOpen(false);
                                    handleScroll(item.path.toLowerCase().replace('#', ''));
                                }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className='md:block hidden'>
                            <ModeToggle />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header