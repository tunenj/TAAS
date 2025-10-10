// components/PasswordRequirements.tsx
import React from "react"

type Props = {
    password: string
}

const checks = [
    {
        label: "Minimum 8 characters",
        test: (pw: string) => pw.length >= 8,
    },
    {
        label: "1 UPPERCASE",
        test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
        label: "1 Number",
        test: (pw: string) => /\d/.test(pw),
    },
    {
        label: "1 Special character",
        test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
]

const PasswordRequirements: React.FC<Props> = ({ password }) => {
    return (
        <div className="my-3">
            <div className="font-semibold text-black mb-1">Requirements</div>
            <div className="flex flex-wrap gap-3">
                {checks.map(({ label, test }, idx) => {
                    const passed = test(password)
                    return (
                        <div key={label} className="flex items-center space-x-1 text-sm">
                            <span
                                className={`h-5 w-5 flex items-center justify-center rounded-full border ${passed ? 'bg-green-100 border-green-400 text-green-600' : 'bg-gray-100 border-gray-300 text-gray-300'}`}
                            >
                                {passed ? (
                                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeWidth="2" d="M5 10l4 4 6-7" />
                                    </svg>
                                ) : (
                                    <span className="w-2 h-2 bg-gray-300 rounded-full block"></span>
                                )}
                            </span>
                            <span
                                className={passed ? "text-gray-600" : "text-gray-400"}
                            >
                                {label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PasswordRequirements
