import React from 'react';

// Import your icons
import { FaChartBar, FaFileAlt, FaClipboardCheck, FaRocket } from 'react-icons/fa';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <FaChartBar className="text-4xl mb-4 text-orange-600 mx-auto" />,
            title: 'Real-time Analytics',
            description: 'Clearly outline your testing objectives and desired outcomes within the Auditem platform.'
        },
        {
            icon: <FaFileAlt className="text-4xl mb-4 text-orange-600 mx-auto" />,
            title: 'Generate Tests',
            description: 'Creates robust test cases based on your defined specifications.'
        },
        {
            icon: <FaClipboardCheck className="text-4xl mb-4 text-orange-600 mx-auto" />,
            title: 'Real-time Analytics',
            description: 'Run tests with a click and review test performance analytics and comprehensive reports.'
        },
        {
            icon: <FaRocket className="text-4xl mb-4 text-orange-600 mx-auto" />,
            title: 'Optimize & Delivery',
            description: 'Use insights to refine your applications, ensuring high quality and faster delivery cycles.'
        },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center">{step.icon}</div> {/* Center the icon */}
                            <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                            <p className="mt-2 text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
