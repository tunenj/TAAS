// components/CallToAction.tsx

import React from 'react';

const CallToAction: React.FC = () => {
    return (
        <section className="py-6 bg-[#FDF1ED]  pb-12 text-center">
            <h2 className="text-2xl font-bold pt-4">Ready to Transform Your Testing Strategy?</h2>
            <div className="flex justify-center mt-6 space-x-4">
                <button className="px-6 py-2 border border-[#E95D28] text-[#E95D28] rounded-2xl transition duration-300 hover:bg-[#E95D28] hover:text-white">
                    Request Demo
                </button>
                <button className="px-6 py-2 bg-[#E95D28] text-white rounded-2xl transition duration-300 hover:bg-orange-600">
                    Get Started
                </button>
            </div>
        </section>
    );
};

export default CallToAction;