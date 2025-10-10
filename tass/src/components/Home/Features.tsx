"use client";

import { useState } from 'react';
import Head from 'next/head';

// Define TypeScript interfaces
interface Feature {
    title: string;
    description: string;
}

export default function FinanceAnalytics() {
    const [activeTab, setActiveTab] = useState<string>('dashboard');

    // Sample features data
    const features: Feature[] = [
        {
            title: "Automated Test Generation",
            description: "Leverage AI to automatically generate comprehensive test cases, significantly reducing manual effort and time."
        },
        {
            title: "Real-time Analytics",
            description: "Gain instant insights into your test performance with detailed dashboards and reporting, enabling quick decision-making."
        },
        {
            title: "Seamless Integrations",
            description: "Connect effortlessly with your existing CI/CD pipelines, project management tools, and other development platforms."
        },
        {
            title: "Collaborative Environment",
            description: "Facilitate team collaboration with shared test plans, results, and reporting features for efficient teamwork."
        },
        {
            title: "Scheduled Executions",
            description: "Gain instant insights into your test performance with detailed dashboards and reporting, enabling quick decision-making."
        },
        {
            title: "Real-time Analytics",
            description: "Gain instant insights into your test performance with detailed dashboards and reporting, enabling quick decision-making."
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Features Section */}
                <section className="mb-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Key Features
                        </h2>
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
