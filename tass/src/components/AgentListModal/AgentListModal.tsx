"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

/* ================= TYPES ================= */

type Agent = {
  id: number;
  userId: string;
  name: string;
  email: string;
  avatar: string;
};

type AgentAssignModalProps = {
  onClose: () => void;
  onAssign?: (userIds: string[]) => Promise<string | undefined>;
  taskLocation: string;
};

/* ================= COMPONENT ================= */

const AgentAssignModal: React.FC<AgentAssignModalProps> = ({
  onClose,
  onAssign,
  taskLocation = "", // ✅ FIX: default value
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { BASE_URL, accessToken } = useAuth();

  /* ================= FETCH AGENTS ================= */

  useEffect(() => {
    const fetchAgents = async () => {
      if (!BASE_URL || !accessToken) return;

      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/org/admin/users/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch agents");

        const data = await res.json();

        const mappedAgents: Agent[] = data.results.map(
          (user: any, index: number) => ({
            id: index,
            userId: user.id,
            name:
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              user.username ||
              "Unknown",
            email: user.email || "No email",
            avatar: "/images/image.png",
          })
        );

        setAgents(mappedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [BASE_URL, accessToken]);

  /* ================= HANDLERS ================= */

  const toggleSelect = (id: number) => {
    setSelectedAgents((prev) =>
      prev.includes(id)
        ? prev.filter((agentId) => agentId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAgents.length === agents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(agents.map((a) => a.id));
    }
  };

  const handleAssignClick = async () => {
    if (selectedAgents.length === 0) {
      alert("Please select at least one agent");
      return;
    }

    const selectedUserIds: string[] = selectedAgents
      .map((id) => agents.find((a) => a.id === id)?.userId)
      .filter((id): id is string => Boolean(id));

    if (selectedUserIds.length === 0) {
      alert("No agents selected");
      return;
    }

    try {
      await onAssign?.(selectedUserIds);
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
    }
  };

  /* ================= FILTER ================= */

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="absolute left-100 bg-white bg-opacity-40 flex shadow-md justify-center items-center z-50 mt-10">
      <div className="bg-white rounded-xl w-[430px] max-h-[600px] shadow-lg flex flex-col p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xs text-gray-500 mb-2">
          Task Location:{" "}
          <span className="font-medium">{taskLocation}</span>
        </h2>

        <div className="flex justify-between items-center mb-3 pr-6">
          <h2 className="text-gray-800 font-semibold text-sm">
            List of Agents ({agents.length})
          </h2>

          <input
            type="text"
            placeholder="Search for Agents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none w-[160px]"
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={
              agents.length > 0 && selectedAgents.length === agents.length
            }
            onChange={selectAll}
            className="accent-orange-500 cursor-pointer"
          />
          <label className="text-sm text-gray-600">
            Select all ({selectedAgents.length} selected)
          </label>
        </div>

        <div className="overflow-y-auto flex-1 pr-2">
          {loading && (
            <p className="text-center py-4 text-gray-500">
              Loading agents...
            </p>
          )}

          {!loading && filteredAgents.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              {searchTerm
                ? "No agents match your search"
                : "No agents found"}
            </p>
          )}

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

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {agent.name}
                </p>
                <p className="text-xs text-gray-500">{agent.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {agent.userId}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            {selectedAgents.length} agent(s) selected
          </span>

          <button
            onClick={handleAssignClick}
            disabled={selectedAgents.length === 0}
            className={`bg-orange-500 text-white text-sm px-6 py-1.5 rounded hover:bg-orange-600 ${
              selectedAgents.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Assign
            {selectedAgents.length > 0
              ? ` (${selectedAgents.length})`
              : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentAssignModal;
