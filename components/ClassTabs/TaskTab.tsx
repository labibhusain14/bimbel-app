"use client";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: "active" | "completed" | "closed";
  submissions: number;
  totalStudents: number;
}

const IconClock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Prototype Low-Fidelity E-Commerce",
    description: "Buat prototype low-fidelity untuk aplikasi e-commerce",
    deadline: "Besok, 23:59",
    status: "active",
    submissions: 38,
    totalStudents: 42,
  },
  {
    id: 2,
    title: "Analisis Kompetitor Design",
    description: "Analisis design dari 3 aplikasi e-commerce terkemuka",
    deadline: "3 hari lagi",
    status: "active",
    submissions: 25,
    totalStudents: 42,
  },
  {
    id: 3,
    title: "Design System Workshop",
    description: "Membuat design system untuk project besar",
    deadline: "Minggu depan",
    status: "completed",
    submissions: 42,
    totalStudents: 42,
  },
];

export default function ClassTaskTab({ classId }: { classId: string }) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-50 border-blue-200";
      case "completed":
        return "bg-green-50 border-green-200";
      case "closed":
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "completed":
        return "Selesai";
      case "closed":
        return "Ditutup";
    }
  };

  return (
    <div>
      {/* Tasks List */}
      <div className="grid gap-4">
        {dummyTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer group ${getStatusColor(
              task.status
            )}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {task.title}
                  </h3>
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                    task.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <IconClock />
                    {task.deadline}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <IconCheckCircle />
                    {task.submissions}/{task.totalStudents} pengumpulan
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="shrink-0 sm:text-right">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.round((task.submissions / task.totalStudents) * 100)}%
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all"
                    style={{
                      width: `${(task.submissions / task.totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {dummyTasks.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <IconClock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">Belum ada tugas</p>
          <p className="text-sm text-gray-500">Guru akan menambahkan tugas di sini</p>
        </div>
      )}
    </div>
  );
}
