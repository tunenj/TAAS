"use client";

import { useState } from "react";
import Head from "next/head";

// Define TypeScript interfaces
interface Feature {
    title: string;
    description: string;
}

export default function FinanceAnalytics() {
    const [activeTab, setActiveTab] = useState<string>("dashboard");

    // Sample features data
    const features: Feature[] = [
        {
            title: "Accelerate Development",
            description:
                "Streamline your testing process to speed up development cycles and bring products to market faster.",
        },
        {
            title: "Enhance Reliability",
            description:
                "Improve software quality and reduce post-release delays with thorough and consistent testing.",
        },
        {
            title: "Reduce Costs",
            description:
                "Lower operational expenses by automating repetitive tasks and optimizing resource allocation in testing.",
        },
    ];

    return (
        <div className="bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Features Section */}
                <section className="mb-0"> {/* Removed bottom margin here */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-12 hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
