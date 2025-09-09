'use client'

import dynamic from 'next/dynamic'
import HeroCountdown from '@/components/home/HeroCountdown'
import RegistrantsByMajor from '@/components/home/RegistrantsByMajor'
import YearlyStats from '@/components/home/YearlyStats'
import HeroAlternative from '@/components/home/HeroAlternative'
import SectionBG from '@/components/home/SectionBG'
import { FAQSection } from '@/components/home/FAQSection'
import React from 'react'

const SimpleSlider = dynamic(
  () => import('@/components/home/SimpleSlider').then((mod) => ({ default: mod.SimpleSlider })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
)

const VENUE_IMAGES = [
  { src: '/images/venue1.jpg', alt: 'Venue 1' },
  { src: '/images/venue2.jpg', alt: 'Venue 2' },
  { src: '/images/venue3.jpg', alt: 'Venue 3' },
]

const ALL_DOCUMENTATION_IMAGES = [
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20Mutafawwiq.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20Panitia.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20Tamu%20Prioritas.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20Wisudawan.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20Wisudawati.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2024%20masyaikh.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2023%20Masyaikh%202.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2023%20Peserta%20Wisudawan.jpg',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2023%20Peserta%20Wisudawati.jpg',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2023%20wisudawan.jpg',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2022%20Panitia.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2022%20Peserta%20Wisuda.JPG',
  'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/gallery/2022%20Wisudawati.JPG',
]

// Function to get random images as individual slides
function getRandomImageSlides(count: number = 5) {
  const shuffled = [...ALL_DOCUMENTATION_IMAGES].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map((img, index) => ({
    id: index + 1,
    image: img,
    totalImages: ALL_DOCUMENTATION_IMAGES.length,
  }))
}

const AFTER_MOVIES = [
  {
    year: 2024,
    youtube: 'https://www.youtube.com/watch?v=zG_GedpGMCI',
    thumb: '/images/am2024.jpg',
    title: 'Wisuda PPMI Mesir 2024 - After Movie',
  },
]

const KESAN_PESAN = [
  {
    name: 'Dr. Han Han Ulumuddin Ismail, Lc. M.A.',
    major: "Lughah 'Arabiyah Qism Ushul Lughah",
    year: '2023',
    achievement: 'Doktoral',
    text: 'Adalah suatu kebanggaan tersendiri bisa belajar sampai lulus di Universitas Al Azhar, salah satu universitas tertua di dunia, gudangnya ilmu keislaman dan kebanggaan ini semakin lengkap dengan mengikuti acara wisuda yang tiap tahun diadakan oleh PPMI Mesir. Wisuda merupakan acara sakral dan bersejarah bagi siapa saja yang menyandang status mahasiswa, akan tetapi kebanggaan dan kebahagiaan ini idealnya jangan berhenti hanya pada tampilan luar dan acara simbolik belaka, perlu adanya intropeksi diri bertanya kepada diri apakah Al-Azhar dengan beribu kelebihannya sudah berbanding lurus dengan kapasitas ilmu yang kita miliki. Jika jawabannya belum, maka wisuda ini bukanlah akhir dari perjuangan dan pembelajaran. Wisuda bukanlah akhir dari mimpi akan tetapi awal dari perjuangan lain yang menanti untuk menjadi azhari sejati, dengan terus mengaji, mengkaji, dan belajar lebih banyak, mempunyai sifat komitmen dan konsisten, karena sebuah cita-cita tidak akan dimulai tanpa adanya komitmen dan tidak akan selesai tanpa adanya konsisten.',
  },
  {
    name: 'Bassam Irfan Zubaidi, Lc.',
    major: 'Syariah Islamiyah',
    year: '2023',
    achievement: 'Mumtaz Bimartabat Syaraf',
    text: 'Perjuangan dalam belajar dan hidup di Mesir selama 5 tahun, rasanya memang perlu ada momen untuk mensyukuri segala kekuatan yang telah Allah berikan dalam menjalani semua itu, sekaligus juga sebagai momen untuk membahagiakan diri, keluarga, dan teman-teman seperjuangan. Juga sebagai refreshing, seperti yang dilakukan oleh ulama kita, terkadang mereka pergi ke taman, kebun, dan tempat indah lainnya, dalam rangka beristirahat sejenak, wisuda pun buat saya demikian. Namun wisuda bukanlah akhir dari perjalanan seorang penuntut ilmu, ibarat jalan tol, ini merupakan rest area, tempat orang-orang beristirahat sejenak, mengumpulkan kembali tekad dan kekuatan, untuk kembali menempuh perjalanan, yang bisa saja jauh lebih panjang dari yang sebelumnya.',
  },
  {
    name: 'Didik Harianto, Lc.',
    major: 'Tafsir Alquran',
    year: '2023',
    achievement: 'Mumtaz Bimartabat Syaraf',
    text: 'Hal yang paling berkesan dan membekas pada pikiran dan pribadi saya sendiri selama menempuh pendidikan di Al-Azhar Al-Syarif baik jami\' maupun jami\'atan adalah tuntutan adanya apa yang dinamakan "Taadud Syuyukhi Tholibil Ilmi" yaitu ragamnya guru bagi seorang pencari ilmu. Ragamnya pengetahuan dan ilmu seorang Tholib itulah yang akan memperkaya pemikiran dan akal seorang Tholib. Menjadikan sisi keilmiahan dan kehidupannya dalam pikirannya imbang, tidak tasyaddud kiri maupun kanan. Dalam artian kokoh. Karena pencukupan hanya kepada satu guru menjadikan Tholib tidak melihat kecuali sosok sang Guru. Tidak mengenal atau bahkan mendengar kecuali hanya ucapan dan fatwa sang Guru. Teruslah kalian wahai penuntut ilmu yang sedang berjuang untuk menjadi seorang Azhary yang sesungguhnya, untuk senantiasa menuntut ilmu dan mengajarkannya. Entah apapun kelak profesi anda sekalian.',
  },
  {
    name: 'Rahmiatul Aini',
    major: 'Lughah Arabiyah',
    year: '2022',
    achievement: 'Lulusan terbaik',
    text: 'Lima tahun, mengubah banyak hal. Cara pandang, daya juang, kekuatan untuk terus berjalan. Saya belajar, untuk lebih menghargai usaha daripada hasil. Semua perjuangan patut dirayakan, karena kekuatan kita butuh disirami cinta agar ia bisa tumbuh lebih besar lagi. Wisuda ini bagi saya adalah salah satu bentuk perayaan dan penghargaan, untuk mereka yang selama lima tahun ini terus berjalan dan tidak berhenti untuk berproses.',
  },
  {
    name: 'Mohamad Yusup Suhada',
    major: 'Syariah Islamiyah',
    year: '2022',
    achievement: 'Lulusan terbaik',
    text: "Ada kawan saya yang memaksakan diri menghadiri ruang ujian. Padahal, malam hari sebelum ujian dia dirawat di rumah sakit karena kelelahan. Ada pula kawan saya yang berkali-kali rosib, namun tetap berusaha melanjutkan pendidikan. Kita punya kisah yang berbeda, tapi kita punya kesamaan. Kita sama-sama banyak menghabiskan malam untuk menghafal materi kuliah, sama-sama sering memaksakan otak untuk memahami pelajaran, melelahkan tubuh untuk menghadiri perkuliahan dan pengajian. Menjadi wisudawan al-Azhar adalah sya'i 'adzim, ini tentang bagaimana kita mengapresiasi diri sendiri dan kawan seperjuangan. Mari berbahagia!",
  },
  {
    name: 'Hamzah Assad Abdul',
    major: 'Akidah & Filsafat',
    year: '2022',
    achievement: 'Lulusan terbaik',
    text: 'Bagi saya, wisuda adalah momen sakral yang dilaksanakan setelah seseorang menamatkan studinya, sebagai salah satu bentuk apresiasi atas usaha yang telah diupayakan hingga masa belajarnya selesai. Lebih dari itu, Wisuda PPMI Mesir adalah hajat tahunan mahasiswa/i Indonesia di Mesir khususnya – dan mahasiswa/i asing umumnya – yang dilakukan secara rutin setiap tahunnya. Perayaan wisuda tersebut dihadiri oleh jajaran tamu KBRI Kairo & Masyayikh Al-Azhar yang akan memberikan takrim kepada para lulusan yang berprestasi pada wisuda ini. Harapannya, semoga dengan kehadiran Wisuda PPMI Mesir dari tahun ke tahun, hal ini bisa mendongkrak animo & semangat seluruh mahasiswa/i Indonesia di Mesir dalam menempuh studinya dengan lancar dan meraih hasil yang maksimal.',
  },
  {
    name: 'Marzuki Rahmat Fendi',
    major: "Lughah Arabiyah - 'Ammah",
    year: '2024',
    achievement: "Mumtaz ma'a Martabah al-Syaraf",
    text: 'Megahnya al-Azhar dihiasi indahnya Mesir menjadikannya poros keilmuan Islam selama berabad-abad hingga saat ini. Ia berperan memupuk rasa cinta di hati setiap penimba ilmu kepada ilmu, pemilik ilmu, dan sumber ilmu; membuat hati tak pernah beranjak dari mencinta. Derajat yang sangat tinggi yang menjadi ciri khas seorang Azhari sehingga selalu totalitas dalam segala sisi. Mungkin nama al-Azhar terasa terlalu agung untuk disandang. Gelar alim juga belum layak untuk disematkan, bahkan berusaha menjadi talib ilmu saja masih kesusahan. Namun, tetap saja, ke mana pun kita berjalan, sekarang gelar Azhari sudah terlanjur terpangpang. Pertanyaannya adalah, sudah sampai mana kita memantaskan?!',
  },
  {
    name: 'Ihya Muthmainna',
    major: 'Dirasat Islamiyah – Syariah Islamiyah',
    year: '2024',
    achievement: "Mumtaz ma'a Martabah al-Syaraf",
    text: 'Al-Azhar al-Syarif bukan hanya sekadar tempat belajar dan menimba ilmu, tetapi juga tempat untuk tumbuh dan berkembang menjadi pribadi lebih baik. Merupakan salah satu nikmat yang besar ketika Allah anugerahkan kita untuk bisa duduk di bangku perkuliahan, bersimpuh di bawah kaki para masyayikh, serta mengambil ilmu dari kiblatnya ilmu keislaman. Bagi seseorang yang telah menyelesaikan jenjang pendidikannya, wisuda merupakan momen yang sangat ditunggu. Momen sakral lagi istimewa ini, tersalurkan dengan adanya wisuda yang dilaksanakan oleh PPMI Mesir. Berada di tanah perantauan bukanlah hal yang mudah. Banyak lika-liku di dalamnya. Akan tetapi, yang berat bukanlah jauh dari keluarga, melainkan tanggung jawab memikul gelar Lc serta gelar Azhari(an). Ada amanah besar yang Allah titipkan di bahu kita, yaitu tanggung jawab berpikrah untuk agama serta tanggung jawab dunia dan akhirat.',
  },
  {
    name: 'Nilakandi Hanifah Lazuardi',
    major: 'Dirasat Islamiyah wa Arabiyah – Hadis wa Ulumuhu',
    year: '2024',
    achievement: 'Magister - Mumtaz',
    text: 'Bahagia dan bersyukur kepada Allah atas nikmat yang sempurna ini, diberi kesempatan menuntut ilmu di al-Azhar. Dan, yang paling mengesankan adalah bertemu dengan para masyayikh yang sangat tawadhu\', moderat, penyampai wawasan yang luas dan keilmuan dengan sanad yang tersambung, penyabar tanpa batas, kegigihan dan semangat yang menular bagi siapa pun yang mau menerima. Dan, selama belajar di al-Azhar, kita tidak hanya mendapatkan ilmu di kitab, tetapi di mana pun kita melangkahkan kaki untuk hadir di majelis ilmu, akan selalu ada ilmu dan keberkahan di dalamnya. Untuk rekan-rekan wisudawan/ti, dengan selalu memohon pertolongan Allah, harapannya, semoga kita semua menjadi "Azhari" yang senantiasa memegang teguh pilar-pilar yang dimiliki oleh al-Azhar, menghiasi diri dengan akhlak yang mulia, dan istiqamah mengamalkan ilmu yang dimiliki, dapat berkhidmat, dan menyebarkan Islam di seluruh lini kehidupan. Semangat!',
  },
  {
    name: 'Fery Ramadhansyah, Lc., M.A., Ph.D.',
    major: 'Syariah Islamiyah – Darul Ulum – Universitas Kairo',
    year: '2024',
    achievement: "Mumtaz ma'a Martabah al-Syaraf",
    text: 'Bagi saya, belajar itu adalah proses. Butuh waktu lama untuk bisa sampai di titik ini. Namun, wisuda bukanlah akhir dari perjuangan menuntut ilmu. Sebab, masih luas samudera ilmu yang perlu diselami agar bisa menemukan mutiara-mutiara pengetahuan. Siapa pun mereka yang pernah belajar di Mesir, pasti merasakan lelahnya menuntut ilmu. Begitu pun saya, baik selama di Universitas al-Azhar ataupun Universitas Kairo, dua kampus ini benar-benar mengajarkan pentingnya proses untuk menjadi orang yang berilmu. Pesan saya, belajarlah untuk mendapatkan ilmu. Jangan belajar sekadar hanya ingin mendapat gelar. Karena hanya dengan ilmu, gelar bisa berguna. Sebaliknya, tanpa ilmu, maka gelar bisa membuat seseorang menjadi malu.',
  },
]

export default function HomePage() {
  const [documentationSlides, setDocumentationSlides] = React.useState(() => getRandomImageSlides())

  const refreshDocumentation = () => {
    setDocumentationSlides(getRandomImageSlides())
  }

  // Current documentation data using state
  const currentDocumentation = documentationSlides

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <div className="section-connected">
        <HeroAlternative date={new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString()} />
      </div>

      {/* Registrants per major (client) */}
      <div className="section-connected">
        <RegistrantsByMajor />
      </div>

      {/* Venue slider */}
      {/*<SectionBG className="section-connected">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
              Venue Wisuda
            </h2>
          </div>
          <SimpleSlider
            items={VENUE_IMAGES}
            renderItem={(item: any) => (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/20 bg-primary/5">
                <div className="absolute inset-0 flex items-center justify-center text-primary/50 text-xs">
                  {item.alt} (Placeholder)
                </div>
              </div>
            )}
          />
        </div>
      </SectionBG>*/}

      {/* Documentation slider */}
      <SectionBG className="section-connected" radialPos="25%_32%">
        <div className="mx-auto max-w-6xl px-4 relative">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/80 bg-clip-text text-transparent">
                Dokumentasi Tahun ke Tahun
              </h2>
              <p className="mt-2 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-md leading-relaxed">
                Jejak visual perjalanan wisuda. Setiap tahun menyimpan cerita dan kebanggaan
                tersendiri.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                Arsip Terkurasi
              </span>
            </div>
          </div>
          <SimpleSlider
            ariaLabel="Dokumentasi Wisuda per Tahun"
            variant="fade"
            interval={6000}
            pauseOnHover
            showArrows
            showDots
            items={currentDocumentation}
            renderItem={(item: any) => (
              <div className="group relative space-y-4">
                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#22140E] via-[#2B1810] to-[#150C07] ring-1 ring-[#E07C45]/10">
                  {/* Single full-size image */}
                  <img
                    src={item.image}
                    alt={`Dokumentasi Wisuda ${item.id}`}
                    className="w-full h-full object-cover"
                  />

                  {/* decorative layers */}
                  <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(232,122,69,0.22),transparent_70%)]" />

                  {/* top bar */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                      Foto {item.id}/5
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-[#E07C45]/20 to-[#B8451A]/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#EAB195] border border-[#E07C45]/30 backdrop-blur-sm">
                      {item.totalImages}+ Total
                    </span>
                  </div>

                  {/* focus ring overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-[#E07C45]/50 transition" />
                </div>

                {/* Description and links container - Below image */}
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(224,124,69,0.25),transparent_60%)] opacity-70" />
                  <div className="relative z-10">
                    <p className="text-[11px] leading-snug text-[#FCEFEA]/80">
                      Koleksi foto dokumentasi wisuda. {item.totalImages}+ momen kebersamaan &
                      pencapaian wisudawan.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            'https://drive.google.com/drive/folders/1xfnkqbtVzoeovq6q_HyE0-aURmKZka0o?usp=drive_link',
                            '_blank',
                          )
                        }
                        className="relative inline-flex items-center rounded-md bg-gradient-to-r from-[#E07C45] to-[#B8451A] px-3 py-1.5 text-[10px] font-medium text-white shadow/30 shadow-[#E07C45]/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07C45]/40 group"
                      >
                        <span className="relative z-10">Lihat Gallery Lengkap</span>
                        <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />
                      </button>
                      <button
                        type="button"
                        onClick={refreshDocumentation}
                        className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur-sm transition hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </SectionBG>

      {/* After movie slider */}
      <SectionBG className="section-connected">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
                After Movie
              </h2>
              <p className="mt-2 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-md leading-relaxed">
                Dokumentasi visual momen berharga wisuda. Kenangan indah yang akan selalu terpatri
                dalam memori.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                Video Resmi
              </span>
            </div>
          </div>
          <SimpleSlider
            items={AFTER_MOVIES}
            renderItem={(item: any) => (
              <div className="group relative space-y-4">
                {/* Video Container */}
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#20140F] via-[#261711] to-[#140B07] ring-1 ring-[#E07C45]/10">
                  {/* YouTube Embed */}
                  <div className="absolute inset-0">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${item.youtube.split('v=')[1]}`}
                      title={item.title || `After Movie ${item.year}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Top info bar */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                      {item.year}
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-[#E07C45]/20 to-[#B8451A]/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#EAB195] border border-[#E07C45]/30 backdrop-blur-sm">
                      After Movie
                    </span>
                  </div>

                  {/* Focus ring overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-[#E07C45]/50 transition" />
                </div>

                {/* Title and Button Container - Below Video */}
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(224,124,69,0.25),transparent_60%)] opacity-70" />
                  <div className="relative z-10">
                    <p className="text-[12px] leading-snug text-[#FCEFEA]/90 font-medium">
                      {item.title || `Wisuda PPMI Mesir ${item.year}`}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(item.youtube, '_blank')}
                        className="relative inline-flex items-center rounded-md bg-gradient-to-r from-[#E07C45] to-[#B8451A] px-4 py-2 text-[11px] font-medium text-white shadow/30 shadow-[#E07C45]/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07C45]/40 group"
                      >
                        <span className="relative z-10">Buka di YouTube</span>
                        <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />
                      </button>
                      <span className="text-[10px] text-[#FCEFEA]/60">
                        Klik untuk menonton di YouTube
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </SectionBG>

      {/* Yearly stats (client) */}
      <div className="section-connected">
        <YearlyStats />
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonials */}
      <SectionBG className="section-connected" radialPos="60%_30%">
        <div className="mx-auto max-w-6xl px-4 relative">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-transparent">
                Kesan Pesan Wisudawan & Wisudawati
              </h2>
              <p className="mt-3 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-lg leading-relaxed">
                Refleksi dan pengalaman pribadi wisudawan Universitas Al-Azhar. Kisah perjuangan,
                harapan, dan pesan mendalam bagi generasi penerus.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/65 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                Kurasi Otentik
              </span>
            </div>
          </div>
          <SimpleSlider
            ariaLabel="Testimoni Alumni"
            variant="scale"
            interval={7000}
            pauseOnHover
            showArrows
            showDots
            items={Array.from({ length: Math.ceil(KESAN_PESAN.length / 2) }, (_, i) =>
              KESAN_PESAN.slice(i * 2, i * 2 + 2),
            )}
            renderItem={(group: any) => (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {group.map((t: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border border-white/12 bg-gradient-to-br from-[#20140F] via-[#261711] to-[#140B07] p-5 backdrop-blur-sm ring-1 ring-[#E07C45]/10"
                  >
                    {/* subtle overlays */}
                    <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.07),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(224,124,69,0.18),transparent_55%)]" />
                    {/* quote icon */}
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-wide text-[#EAB195]/70">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#E07C45]/30 to-[#B8451A]/20 text-[#FCEFEA] text-xs font-bold">
                        “
                      </span>
                      <span className="uppercase">Kesan Pesan</span>
                    </div>
                    <p className="relative z-10 text-[13px] leading-relaxed text-[#FCEFEA]/80 min-h-[200px]">
                      <span className="italic">"{t.text}"</span>
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[11px] font-medium text-[#EAB195]/70">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#E07C45] to-[#B8451A] text-[10px] font-semibold text-white flex items-center justify-center shadow ring-1 ring-white/20">
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[11px] text-[#FCEFEA]/85 font-semibold">
                            {t.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-white/40">
                            {t.major}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[9px] tracking-wide text-white/55 backdrop-blur-sm">
                          {t.year}
                        </span>
                        <span className="text-[8px] text-white/40 mt-1">{t.achievement}</span>
                      </div>
                    </div>
                    {/* hover ring */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-[#E07C45]/50 transition" />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </SectionBG>
    </div>
  )
}
