"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Agent = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

const agents: Agent[] = [
  { id: 1, name: "Arlene McCoy", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 2, name: "Ralph Edwards", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
  { id: 3, name: "Wade Warren", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 4, name: "Kristin Watson", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
  { id: 5, name: "Ralph Edwards", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 6, name: "Kristin Watson", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
   { id: 7, name: "Arlene McCoy", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 8, name: "Ralph Edwards", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
  { id: 9, name: "Wade Warren", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 10, name: "Kristin Watson", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
  { id: 11, name: "Ralph Edwards", email: "tim.jennings@example.com", avatar: "/images/image.png" },
  { id: 12, name: "Kristin Watson", email: "tim.jennings@example.com", avatar: "/images/image1.png" },
];

const AgentAssignModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelect = (id: number) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((agentId) => agentId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAgents.length === agents.length) setSelectedAgents([]);
    else setSelectedAgents(agents.map((a) => a.id));
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute  left-100 bg-white bg-opacity-40 flex shadow-md justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[430px] max-h-[500px] shadow-lg flex flex-col p-4 relative">
        
        {/*Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-3 pr-6">
          <h2 className="text-gray-800 font-semibold text-sm">List of Agents</h2>
          <input
            type="text"
            placeholder="Search for Agents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none w-[160px]"
          />
        </div>

        {/* Select All */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selectedAgents.length === agents.length}
            onChange={selectAll}
            className="accent-orange-500 cursor-pointer"
          />
          <label className="text-sm text-gray-600">Select all</label>
        </div>

        {/* Agent List */}
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedAgents.includes(agent.id)}
                onChange={() => toggleSelect(agent.id)}
                className="accent-orange-500 cursor-pointer"
              />
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={35}
                height={35}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Assign Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => alert(`Assigned to ${selectedAgents.length} agents`)}
            className="bg-orange-500 text-white text-sm px-6 py-1.5 rounded hover:bg-orange-600"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentAssignModal;
