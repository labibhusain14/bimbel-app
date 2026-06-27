"use client";

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconBadge = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function ClassMembersTab({ classId, members }: { classId: string, members: any[] }) {
  const teacher = members.find((m) => m.role === "teacher");
  const students = members.filter((m) => m.role === "student" || m.role === "admin" && m.id !== teacher?.id);

  return (
    <div className="space-y-8">
      {/* Teacher Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          Pengajar
        </h2>
        {teacher && (
          <div className="bg-white rounded-xl border border-indigo-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10">
              {teacher.name ? teacher.name.charAt(0).toUpperCase() : "G"}
            </div>
            
            <div className="flex-1 min-w-0 z-10">
              <h3 className="text-base font-bold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                <IconBadge />
                Guru Utama
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Students Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Siswa ({students.length})
          </h2>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {students.map((student) => (
            <div
              key={student.id}
              className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0">
                {student.name ? student.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {student.name}
                </h3>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">
              Belum ada siswa yang tergabung.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
