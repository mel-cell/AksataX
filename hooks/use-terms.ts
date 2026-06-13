"use client";

import { useState, useCallback } from "react";

export interface TermsSection {
  id: string;
  title: string;
  content: string[];
  items?: string[];
}

export interface TermsDocument {
  slug: string;
  title: string;
  subtitle: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: TermsSection[];
}

export const AKSATAX_RULE: TermsDocument = {
  slug: "aksatax-rule",
  title: "Aturan AksataX",
  subtitle: "Panduan komunitas untuk menjaga AksataX tetap aman, sehat, dan produktif bagi semua orang.",
  version: "v2.1",
  effectiveDate: "1 Januari 2025",
  lastUpdated: "15 Mei 2025",
  sections: [
    {
      id: "prinsip-umum",
      title: "Prinsip Umum",
      content: [
        "AksataX adalah ruang diskusi terbuka untuk berbagi ide, pengetahuan, dan pengalaman. Kami percaya bahwa komunitas yang sehat dibangun di atas dasar rasa hormat, kejujuran, dan kolaborasi.",
        "Setiap anggota bertanggung jawab atas konten yang mereka publikasikan. Dengan menggunakan platform ini, kamu menyetujui untuk mematuhi semua aturan yang tercantum di sini.",
      ],
    },
    {
      id: "konten-dilarang",
      title: "Konten yang Dilarang",
      content: [
        "Untuk menjaga keamanan semua pengguna, konten berikut secara tegas dilarang di AksataX:",
      ],
      items: [
        "Konten yang mengandung ujaran kebencian berbasis ras, agama, gender, atau disabilitas",
        "Pelecehan, intimidasi, atau bullying dalam bentuk apapun",
        "Konten pornografi atau eksplisit secara seksual",
        "Informasi palsu (hoaks) yang dapat menyebabkan kerugian nyata",
        "Spam, promosi tidak relevan, atau skema penipuan",
        "Konten yang melanggar hak cipta pihak lain",
        "Ancaman kekerasan atau konten yang mendorong tindakan ilegal",
        "Doxing — menyebarkan informasi pribadi orang lain tanpa izin",
      ],
    },
    {
      id: "etika-berdiskusi",
      title: "Etika Berdiskusi",
      content: [
        "AksataX mendorong diskusi yang konstruktif dan berbasis fakta. Kritik terhadap ide diperbolehkan, namun serangan personal tidak dapat ditoleransi.",
      ],
      items: [
        "Selalu fokus pada topik, bukan pada pribadi seseorang",
        "Berikan sumber yang dapat diverifikasi ketika mengklaim fakta",
        "Tandai konten sensitif dengan tepat",
        "Hindari membanjiri topik dengan komentar berulang",
        "Hormati keputusan moderator",
      ],
    },
    {
      id: "hak-akun",
      title: "Hak & Tanggung Jawab Akun",
      content: [
        "Setiap pengguna hanya boleh memiliki satu akun aktif. Akun duplikat untuk menghindari sanksi akan dihapus beserta akun utamanya.",
        "Kamu bertanggung jawab penuh atas aktivitas yang terjadi melalui akunmu.",
      ],
      items: [
        "Gunakan foto profil dan informasi yang akurat",
        "Jangan menyamar sebagai tokoh publik, brand, atau pengguna lain",
        "Laporkan akun yang dicurigai diretas segera kepada tim dukungan",
      ],
    },
    {
      id: "penegakan-aturan",
      title: "Penegakan Aturan",
      content: [
        "Tim moderasi AksataX memantau platform secara aktif dan merespons laporan pengguna. Pelanggaran akan ditangani berdasarkan tingkat keparahan.",
        "Sanksi dapat berupa peringatan, pembatasan fitur, suspensi akun, hingga pelarangan permanen.",
      ],
    },
    {
      id: "pelaporan",
      title: "Cara Melaporkan Pelanggaran",
      content: [
        "Jika kamu menemukan konten yang melanggar aturan, gunakan tombol Laporkan yang tersedia di setiap postingan atau profil pengguna.",
        "Laporan akan ditinjau dalam waktu 24–48 jam.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: TermsDocument = {
  slug: "privacy-policy",
  title: "Kebijakan Privasi",
  subtitle: "Kami berkomitmen melindungi data pribadimu. Pelajari bagaimana kami mengumpulkan dan menjaga informasimu.",
  version: "v3.0",
  effectiveDate: "1 Januari 2025",
  lastUpdated: "10 Juni 2025",
  sections: [
    {
      id: "data-dikumpulkan",
      title: "Data yang Kami Kumpulkan",
      content: [
        "Kami hanya mengumpulkan data yang diperlukan dan tidak akan pernah menjual datamu kepada pihak ketiga.",
      ],
      items: [
        "Informasi akun: nama, email, foto profil",
        "Konten yang kamu buat: postingan, komentar, interaksi",
        "Data penggunaan: halaman dikunjungi, fitur digunakan",
        "Informasi perangkat: jenis perangkat, browser, alamat IP",
        "Cookie dan teknologi pelacak untuk preferensi sesi",
      ],
    },
    {
      id: "penggunaan-data",
      title: "Bagaimana Kami Menggunakan Datamu",
      content: [
        "Data digunakan untuk mengoperasikan, meningkatkan, dan mempersonalisasi pengalamanmu di AksataX.",
      ],
      items: [
        "Menampilkan konten relevan berdasarkan minatmu",
        "Mengirim notifikasi penting terkait aktivitas akun",
        "Mendeteksi dan mencegah aktivitas penipuan",
        "Menganalisis tren untuk pengembangan fitur baru",
      ],
    },
    {
      id: "berbagi-data",
      title: "Berbagi Data dengan Pihak Ketiga",
      content: [
        "AksataX tidak menjual data pribadimu. Namun dalam kondisi tertentu kami dapat berbagi data dengan penyedia layanan teknis yang terikat perjanjian kerahasiaan.",
        "Dalam kasus penegakan hukum, kami dapat mengungkapkan informasi sesuai perintah pengadilan yang berlaku.",
      ],
    },
    {
      id: "keamanan-data",
      title: "Keamanan Data",
      content: [
        "Kami menerapkan langkah keamanan standar industri untuk melindungi datamu dari akses tidak sah.",
        "Data dienkripsi menggunakan TLS 1.3. Password disimpan dalam bentuk hash bcrypt.",
      ],
      items: [
        "Enkripsi data saat transit dan saat tersimpan",
        "Audit keamanan rutin dan penetration testing",
        "Notifikasi pelanggaran data dalam 72 jam",
      ],
    },
    {
      id: "hak-pengguna",
      title: "Hak-Hak Pengguna",
      content: [
        "Sesuai regulasi perlindungan data, kamu memiliki hak-hak berikut terkait data pribadimu:",
      ],
      items: [
        "Hak akses: meminta salinan data pribadi yang kami simpan",
        "Hak koreksi: memperbarui data yang tidak akurat",
        "Hak penghapusan: meminta penghapusan akunmu",
        "Hak portabilitas: menerima datamu dalam format yang dapat dibaca mesin",
        "Hak keberatan: menolak pemrosesan data untuk pemasaran",
      ],
    },
    {
      id: "cookie",
      title: "Kebijakan Cookie",
      content: [
        "AksataX menggunakan cookie untuk meningkatkan pengalaman penggunaan. Cookie esensial diperlukan untuk fungsi dasar platform.",
        "Kamu dapat mengatur preferensi cookie melalui pengaturan browser atau panel privasi di akunmu.",
      ],
    },
  ],
};

export const USER_AGREEMENT: TermsDocument = {
  slug: "user-agreement",
  title: "Perjanjian Pengguna",
  subtitle: "Syarat dan ketentuan yang mengatur hubungan antara kamu sebagai pengguna dan AksataX sebagai platform.",
  version: "v4.2",
  effectiveDate: "1 Januari 2025",
  lastUpdated: "1 Juni 2025",
  sections: [
    {
      id: "penerimaan",
      title: "Penerimaan Syarat",
      content: [
        "Dengan mendaftar atau menggunakan AksataX, kamu menyatakan telah membaca dan menyetujui seluruh syarat ini.",
        "Batas usia minimum untuk menggunakan platform adalah 13 tahun.",
      ],
    },
    {
      id: "deskripsi-layanan",
      title: "Deskripsi Layanan",
      content: [
        "AksataX adalah platform media sosial berbasis teks untuk berbagi pikiran dan berdiskusi dengan komunitas.",
        "Kami berhak mengubah atau menghentikan layanan kapan saja dengan pemberitahuan sebelumnya.",
      ],
    },
    {
      id: "kepemilikan-konten",
      title: "Kepemilikan Konten",
      content: [
        "Kamu mempertahankan hak kekayaan intelektual atas semua konten orisinal yang kamu buat di AksataX.",
        "Dengan mempublikasikan konten, kamu memberikan AksataX lisensi non-eksklusif untuk menampilkan dan mendistribusikannya di dalam platform.",
      ],
    },
    {
      id: "larangan",
      title: "Penggunaan yang Dilarang",
      content: ["Kamu setuju untuk tidak menggunakan AksataX untuk:"],
      items: [
        "Melanggar hukum atau regulasi yang berlaku di Indonesia",
        "Mengumpulkan data pengguna lain tanpa izin (scraping)",
        "Merusak atau mengakses server AksataX secara tidak sah",
        "Menyebarkan malware atau kode berbahaya",
        "Menggunakan bot atau otomatisasi tanpa izin tertulis",
      ],
    },
    {
      id: "pembayaran",
      title: "Layanan Berbayar",
      content: [
        "AksataX menawarkan fitur premium melalui langganan berbayar. Langganan diperbarui otomatis kecuali dibatalkan sebelum tanggal perpanjangan.",
      ],
      items: [
        "Harga dapat berubah dengan pemberitahuan 30 hari sebelumnya",
        "Tidak ada refund untuk periode langganan yang sudah berjalan",
        "Untuk pertanyaan billing hubungi billing@aksatax.id",
      ],
    },
    {
      id: "batasan-tanggung-jawab",
      title: "Batasan Tanggung Jawab",
      content: [
        "AksataX disediakan 'sebagaimana adanya' tanpa jaminan apapun.",
        "Tanggung jawab total AksataX tidak akan melebihi jumlah yang kamu bayarkan dalam 12 bulan terakhir.",
      ],
    },
    {
      id: "hukum-berlaku",
      title: "Hukum yang Berlaku",
      content: [
        "Perjanjian ini diatur oleh hukum Republik Indonesia. Sengketa diselesaikan melalui Pengadilan Negeri Jakarta Selatan.",
      ],
    },
    {
      id: "perubahan",
      title: "Perubahan Perjanjian",
      content: [
        "AksataX berhak mengubah perjanjian ini kapan saja. Perubahan material diberitahukan minimal 14 hari sebelum berlaku.",
        "Melanjutkan penggunaan platform setelah perubahan berlaku dianggap sebagai persetujuanmu.",
      ],
    },
  ],
};

export const TERMS_MAP: Record<string, TermsDocument> = {
  "aksatax-rule": AKSATAX_RULE,
  "privacy-policy": PRIVACY_POLICY,
  "user-agreement": USER_AGREEMENT,
};

export function useTerms(slug: string) {
  const doc = TERMS_MAP[slug] ?? null;
  const [activeSection, setActiveSection] = useState<string>(
    doc?.sections[0]?.id ?? ""
  );

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return { doc, activeSection, setActiveSection, scrollToSection };
}
