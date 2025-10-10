import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#E95D28] text-white py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">
                {/* Logo and description */}
                <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                        {/* Link to Home with Logo */}
                        <Link href="/">
                            <Image
                                src="/images/logo.png" // Replace with your actual logo path
                                alt="Avetium Logo"
                                width={150} // Adjust width as needed
                                height={50} // Adjust height as needed
                            />
                        </Link>
                    </div>
                    <p className="mt-4 max-w-[14rem] text-sm leading-relaxed">
                        AI-powered Test as a Service for unparalleled efficiency and
                        reliability in software quality assurance
                    </p>
                </div>

                {/* Platform */}
                <div>
                    <h4 className="font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Features</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>

                {/* Products */}
                <div>
                    <h4 className="font-semibold mb-4">Products</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Request a Demo</a></li>
                        <li><a href="#" className="hover:underline">Create account</a></li>
                        <li><a href="#" className="hover:underline">Share feedback</a></li>
                        <li><a href="#" className="hover:underline">Helpdesk</a></li>
                    </ul>
                </div>

                {/* Legals */}
                <div>
                    <h4 className="font-semibold mb-4">Legals</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Guides</a></li>
                        <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="max-w-7xl mx-auto border-t border-white/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
                <p>A product of Avetium</p>
                <p className="my-4 md:my-0">© 2024, All Rights Reserved</p>
                <div className="flex space-x-4">
                    <a href="#"><Facebook size={16} /></a>
                    <a href="#"><Twitter size={16} /></a>
                    <a href="#"><Linkedin size={16} /></a>
                    <a href="#"><Instagram size={16} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
