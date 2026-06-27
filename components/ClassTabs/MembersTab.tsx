"use client";

interface ClassMember {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "student";
  joinedAt: string;
  avatar?: string;
}

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconStar = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const dummyMembers: ClassMember[] = [
  {
    id: 1,
    name: "Rina Kusumawati",
    email: "rina.kusumawati@bimbel.com",
    role: "teacher",
    joinedAt: "4 bulan lalu",
  },
  {
    id: 2,
    name: "Ahmad Fauzan",
    email: "ahmad.fauzan@student.com",
    role: "student",
    joinedAt: "3 bulan lalu",
  },
  {
    id: 3,
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@student.com",
    role: "student",
    joinedAt: "3 bulan lalu",
  },
  {
    id: 4,
    name: "Budi Santoso",
    email: "budi.santoso@student.com",
    role: "student",
    joinedAt: "3 bulan lalu",
  },
  {
    id: 5,
    name: "Maya Putri",
    email: "maya.putri@student.com",
    role: "student",
    joinedAt: "2 bulan lalu",
  },
  {
    id: 6,
    name: "Reza Pratama",
    email: "reza.pratama@student.com",
    role: "student",
    joinedAt: "2 bulan lalu",
  },
  {
    id: 7,
    name: "Dewi Lestari",
    email: "dewi.lestari@student.com",
    role: "student",
    joinedAt: "1 bulan lalu",
  },
  {
    id: 8,
    name: "Adi Wijaya",
    email: "adi.wijaya@student.com",
    role: "student",
    joinedAt: "1 bulan lalu",
  },
];

export default function ClassMembersTab({ classId }: { classId: string }) {
  const teachers = dummyMembers.filter((m) => m.role === "teacher");
  const students = dummyMembers.filter((m) => m.role === "student");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[id % colors.length];
  };

  const renderMemberCard = (member: ClassMember) => (
    <div
      key={member.id}
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`${getAvatarColor(member.id)} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
          {getInitials(member.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {member.name}
            </h3>
            {member.role === "teacher" && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                <IconStar />
                Guru
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate mb-2">{member.email}</p>
          <p className="text-xs text-gray-400">Bergabung {member.joinedAt}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Teachers Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Guru ({teachers.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((member) => renderMemberCard(member))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />

      {/* Students Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Siswa ({students.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((member) => renderMemberCard(member))}
        </div>
      </div>

      {/* Empty State */}
      {dummyMembers.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <IconUser className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">
            Belum ada anggota
          </p>
          <p className="text-sm text-gray-500">
            Anggota kelas akan ditampilkan di sini
          </p>
        </div>
      )}
    </div>
  );
}
