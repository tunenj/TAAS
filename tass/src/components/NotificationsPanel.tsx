// components/NotificationsPanel.tsx
const notifications = [
    { text: 'Task "Review Design Mockups" completed by John Doe.', type: "success" },
    { text: 'Missed deadline: "Finalize Marketing Report" for Project Alpha.', type: "error" },
    { text: "New tester, Sarah Miller, has joined the team.", type: "info" },
    { text: 'Task "Develop API Endpoints" is overdue by 2 days. Yesterday.', type: "warning" },
    { text: 'Task "QA Testing Phase 1" completed by Team A. Yesterday.', type: "success" },
    { text: "Reminder: Weekly team sync meeting at 10:00 AM today.", type: "alert" },
];

export default function NotificationsPanel() {
    return (
        <div className="shadow-md p-5">
            <h2 className="text-lg font-semibold mb-2">Notifications & Alerts</h2>
            <ul className="space-y-3">
                {notifications.map((n, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span
                            className={
                                n.type === "success"
                                    ? "inline-block w-2 h-2 mt-2 rounded-full bg-emerald-500"
                                    : n.type === "error"
                                        ? "inline-block w-2 h-2 mt-2 rounded-full bg-red-500"
                                        : n.type === "warning"
                                            ? "inline-block w-2 h-2 mt-2 rounded-full bg-yellow-400"
                                            : n.type === "alert"
                                                ? "inline-block w-2 h-2 mt-2 rounded-full bg-orange-400"
                                                : "inline-block w-2 h-2 mt-2 rounded-full bg-blue-400"
                            }
                        ></span>
                        <span className="text-sm">{n.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
