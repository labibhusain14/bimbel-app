"use client";

const IconClock = ({ className }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ClassTaskTab({ classId, tasks }: { classId: string, tasks: any[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 border-blue-200";
      case "submitted":
      case "graded":
      case "completed":
        return "bg-green-50 border-green-200";
      case "late":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Belum Selesai";
      case "submitted":
        return "Menunggu Penilaian";
      case "graded":
      case "completed":
        return "Dinilai";
      case "late":
        return "Terlambat";
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Tasks List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
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
                    task.status === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "submitted" || task.status === "graded"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-medium mt-3">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <IconClock />
                    {task.deadline}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="shrink-0 sm:text-right">
                {task.status === "graded" && task.score != null ? (
                  <>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nilai</p>
                    <p className="text-2xl font-extrabold text-green-600 leading-none">{task.score}</p>
                  </>
                ) : (
                  <>
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                       <IconCheckCircle />
                     </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
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
