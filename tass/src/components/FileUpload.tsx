// components/FileUpload.tsx

import React, { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

const FileUpload: React.FC = () => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Handle the file(s) here
            console.log(files);
        }
    };

    return (
        <div className="flex flex-col">
            <label className="block text-gray-700 text-lg mb-2">
                Upload Test Cases/Documents
            </label>

            <label className="flex gap-2 px-2 py-2 border w-44 border-orange-500 rounded-md text-orange-500 cursor-pointer hover:bg-orange-50 transition">
                <Upload className="w-5 h-5" />
                <span>Choose File</span>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        </div>
    );
};

export default FileUpload;
