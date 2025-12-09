interface FormCardProps {
  title: string;
  assign?: boolean;
}

export default function FormCard({ title, assign = false }: FormCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 w-full">
      <p className="text-xs text-gray-600 mb-4 font-semibold">{title}</p>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assign ? (
          <>
            <input
              type="text"
              placeholder="Select supervisor"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <input
              type="text"
              placeholder="Choose agents"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <div className="flex justify-end gap-3 sm:col-span-2 mt-3">
              <button
                type="button"
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
              >
                Assign
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter full name"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <input
              type="email"
              placeholder="name@company.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <input
              type="text"
              placeholder="Enter username"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <input
              type="text"
              placeholder="Nigeria"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <input
              type="text"
              placeholder="27npag12bx"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
            />
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="reset"
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
