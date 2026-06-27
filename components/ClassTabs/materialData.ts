export type Material = {
  id: number;
  title: string;
  description: string;
  type: "video" | "document" | "link";
  uploadedAt: string;
  size?: string;
  classId?: string;
};

const materials: Material[] = [
  { id: 1, title: "Pengenalan UI/UX Design", description: "Video pembelajaran tentang dasar-dasar UI/UX design", type: "video", uploadedAt: "2 hari lalu", classId: "1" },
  { id: 2, title: "Design Principles Handbook", description: "Panduan lengkap prinsip desain modern", type: "document", uploadedAt: "1 minggu lalu", size: "2.5 MB", classId: "1" },
  { id: 3, title: "Figma Tutorial", description: "Link ke tutorial Figma lengkap", type: "link", uploadedAt: "3 hari lalu", classId: "1" },
  { id: 4, title: "Color Theory in Design", description: "Video tentang teori warna dalam desain", type: "video", uploadedAt: "5 hari lalu", classId: "1" },
  { id: 5, title: "User Research Template", description: "Template untuk penelitian pengguna", type: "document", uploadedAt: "2 minggu lalu", size: "1.8 MB", classId: "1" },
];

export function getMaterialsByClass(classId: string) {
  return materials.filter((m) => m.classId === classId);
}

export function getMaterialById(id: number) {
  return materials.find((m) => m.id === id) || null;
}

export default materials;
