"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function OrganizationRegistrationLink() {
  const { accessToken, BASE_URL } = useAuth();

  const [loading, setLoading] = useState(false);
  const [registrationLink, setRegistrationLink] = useState<string>("");

  // Generate the organization registration link
  const generateLink = async () => {
    try {
      setLoading(true);

      // Call backend to generate the link
      const res = await fetch(`${BASE_URL}/org/generate-url/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ allow_public_registration: true }),
      });

      const data = await res.json();

      if (!data?.success) {
        alert(data?.message || "Failed to generate link");
        return;
      }

      const backendLink: string = data.data.organization_link;
      if (!backendLink) {
        alert("Invalid organization link from backend");
        return;
      }

      // Extract slug from backend URL
      const slugMatch = backendLink.match(/\/user\/(.*?)\/register/);
      const slug = slugMatch ? slugMatch[1] : backendLink; // fallback if already just slug

      // Build correct frontend registration URL
      const frontendLink = `${window.location.origin}/auth/register/${slug}`;
      setRegistrationLink(frontendLink);
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    if (!registrationLink) return;
    navigator.clipboard.writeText(registrationLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full md:w-1/2 mt-2">
      <h2 className="text-lg font-semibold mb-1">
        Organization Registration Link
      </h2>

      <p className="text-black mb-1">
        Generate a unique registration link and share it with customers or team members.
      </p>

      <div className="flex items-center gap-2">
        {/* GENERATE BUTTON */}
        <button
          onClick={generateLink}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded-md whitespace-nowrap"
        >
          {loading ? "Generating..." : "Generate Link"}
        </button>

        {/* GENERATED LINK INPUT */}
        {registrationLink && (
          <div className="flex items-center flex-1 gap-2">
            <input
              type="text"
              value={registrationLink}
              readOnly
              className="flex-1 border p-2 rounded-md bg-gray-100 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-black"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
