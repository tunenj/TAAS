// app/email-sent/page.tsx (simplified)
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';


export default function EmailSentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get('email') ?? '';

  // Clear any stored tokens when showing this page
  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="relative flex items-center justify-center bg-gray-100 min-h-screen">
      <Image
        src="/images/imag.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
      />

      <div className="relative bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center z-10">
        <h2 className="text-2xl font-bold text-black mb-4">Activation Email Sent</h2>

        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          We have sent an activation link to:
        </p>

        {email ? (
          <p className="font-semibold text-orange-600 break-all mb-4">
            {email}
          </p>
        ) : (
          <p className="font-semibold text-orange-600 break-all mb-4">
            No email provided
          </p>
        )}

        <div className="text-left bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-700 mb-2">📨 <strong>Check these places:</strong></p>
          <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
            <li>Your email inbox</li>
            <li>Spam or Junk folder</li>
            <li>Promotions tab (Gmail users)</li>
          </ul>
        </div>

        <p className="text-xs text-gray-600 mb-2">
          Click the link in the email to verify your account.
        </p>
      </div>
    </div>
  );
}