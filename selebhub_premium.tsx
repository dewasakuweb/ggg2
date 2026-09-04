import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, Unlock, Crown, Check, User, Video, LogOut, Search, Star, ChevronRight, Menu, X, Plus, Upload, Download, Film } from 'lucide-react';

// ============================================================================
// 🌟 BAGIAN KONFIGURASI: KAMU BISA MENGEDIT SEMUA TEKS & DATA DI SINI 🌟
// ============================================================================

const CONFIG = {
  namaWebsite: "Talent Hub",
  tagline: "Koleksi Video Eksklusif Paling Menggoda — UPDATE TIAP HARI!",
  deskripsi: "Masuki dunia rahasia tanpa batas. Nikmati ribuan koleksi video paling berani, liar, dan memikat dari para talent pujaanmu yang tak akan pernah terungkap di publik. Tuntaskan rasa penasaranmu, tonton sepuasnya, dan biarkan imajinasimu menjadi nyata.",
  
  // Data Selebgram (Kamu bisa TAMBAH, HAPUS, atau EDIT langsung di sini!)
  // Format: { id: (Angka unik), nama: "Nama", username: "@username", pengikut: "Jumlah", foto: "Link Foto" }
  selebgram: [],

  // Data Paket Berlangganan
  paket: [
    {
      nama: "VIP Basic",
      harga: "Rp 129.000",
      durasi: "/ Akses Lifetime",
      fitur: ["Ribuan Video Eksklusif", "Kualitas HD 1080p", "Akses SEMUA Video Eksklusif"],
      rekomendasi: false
    },
    {
      nama: "VVIP Premium",
      harga: "Rp 149.000",
      durasi: "/ Akses Lifetime",
      fitur: ["Ribuan Video Eksklusif", "Akses SEMUA Video Eksklusif", "Update Tiap Hari", "Request Konten Khusus", "Resolusi 4K Ultra HD", "Live Streaming Rahasia", "Grup Chat Eksklusif"],
      rekomendasi: true
    }
  ],

  // Data Video Eksklusif (Simulasi Dashboard)
  videoList: [
    { id: 1, judul: "VLOG: Seharian di Bali tanpa Kamera Media!", seleb: "Anya Geraldine", thumbnail: "https://images.unsplash.com/photo-1516483638261-f4085eeea268?auto=format&fit=crop&w=600&q=80", premium: true },
    { id: 2, judul: "Q&A Jujur: Rahasia yang belum pernah aku ceritakan", seleb: "Rachel Vennya", thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80", premium: true },
    { id: 3, judul: "Behind the Scene Photoshoot Brand X", seleb: "Gabriel Prince", thumbnail: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80", premium: false },
    { id: 4, judul: "Room Tour Rumah Baru 100% Uncut", seleb: "Fuji An", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", premium: true },
    { id: 5, judul: "Persiapan Party Malam Ini! 🥂", seleb: "Anya Geraldine", thumbnail: "https://images.unsplash.com/photo-1470229722913-7c092db62220?auto=format&fit=crop&w=600&q=80", premium: true },
    { id: 6, judul: "Morning Routine Bebas Makeup", seleb: "Fuji An", thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80", premium: false },
  ]
};

// ============================================================================
// KODE APLIKASI UTAMA (TIDAK PERLU DIUBAH KECUALI INGIN UBAH DESAIN/LOGIKA)
// ============================================================================

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk menyimpan daftar selebgram agar bisa ditambah secara dinamis dari UI
  const [selebList, setSelebList] = useState(CONFIG.selebgram);
  
  // State untuk pop-up/modal form tambah kreator
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', username: '', pengikut: '', foto: '' });
  const [previewImage, setPreviewImage] = useState(null);

  // State untuk video singkat (9:16)
  const [shortsList, setShortsList] = useState([]);
  const [showAddShortModal, setShowAddShortModal] = useState(false);
  const [shortFormData, setShortFormData] = useState({ judul: '', namaSeleb: '', videoUrl: '' });

  // Fungsi untuk menangani upload file foto dari perangkat pengguna
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file); // Convert foto menjadi format Base64 agar bisa ditampilkan langsung
    }
  };

  // Fungsi untuk menyimpan data selebgram baru ke dalam daftar
  const handleAddSeleb = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.foto) return; // Wajib isi nama dan foto
    
    // Bikin ID baru
    const newId = selebList.length > 0 ? Math.max(...selebList.map(s => s.id)) + 1 : 1;
    const newEntry = { 
      ...formData, 
      id: newId,
      username: formData.username.startsWith('@') ? formData.username : `@${formData.username}`,
      pengikut: formData.pengikut || "Baru"
    };
    
    // Tambahkan selebgram baru di urutan paling depan
    setSelebList([newEntry, ...selebList]); 
    
    // Tutup modal dan reset form
    setShowAddModal(false);
    setFormData({ nama: '', username: '', pengikut: '', foto: '' }); 
    setPreviewImage(null);
  };

  // Fungsi upload video 9:16
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShortFormData({ ...shortFormData, videoUrl: reader.result });
      };
      reader.readAsDataURL(file); // Convert video jadi Base64
    }
  };

  // Fungsi submit video baru
  const handleAddShort = (e) => {
    e.preventDefault();
    if (!shortFormData.judul || !shortFormData.videoUrl) return;
    if (shortsList.length >= 5) {
      alert("Maksimal hanya 5 video yang diperbolehkan!");
      return;
    }

    const newId = shortsList.length > 0 ? Math.max(...shortsList.map(s => s.id)) + 1 : 1;
    setShortsList([{ ...shortFormData, id: newId }, ...shortsList]);
    setShowAddShortModal(false);
    setShortFormData({ judul: '', namaSeleb: '', videoUrl: '' });
  };

  // Fungsi Export File ke HTML Utuh (Bisa Dijalankan Offline)
  const handleDownloadHTML = () => {
    // Sembunyikan elemen admin (tombol tambah, dll) agar tidak ikut ter-download
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => el.style.display = 'none');

    const appContent = document.getElementById('main-app-container').innerHTML;

    // Munculkan kembali tombol-tombol admin
    adminElements.forEach(el => el.style.display = '');

    const htmlTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${CONFIG.namaWebsite}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: black; color: white; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  </style>
</head>
<body class="selection:bg-pink-500 selection:text-white">
  <div class="min-h-screen bg-black font-sans">
    ${appContent}
  </div>
  
  <script>
    // Script bawaan Ebookviral agar form order tetap berfungsi dan responsif di file HTML hasil download
    const iframe = document.getElementById('myiframe');
    if (iframe) {
      function resizeIframe(height){iframe.style.height=height+'px'}
      function isUrl(string){try{new URL(string); return true}catch(_){return false}}
      function isJSONObject(string){try{const parsed=JSON.parse(string); return typeof parsed==='object'&&parsed!==null}catch(e){return false}}
      function isIframeSameOrigin(){try{const doc=iframe.contentDocument||iframe.contentWindow.document; return true}catch(e){return false}}
      
      window.addEventListener('message',function(e){
        if(e.origin==='https://ebookviral.store'){
          if(isUrl(e.data)){location.href=e.data}
          if(isJSONObject(e.data)&&!isIframeSameOrigin()){
            const message=JSON.parse(e.data);
            if(message.type==='resize'){resizeIframe(message.height)}
          }
        }
      },false);
      
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            iframe.src = iframe.src;
            observer.disconnect();
          }
        });
      });
      observer.observe(iframe);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SelebHub-Export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // Komponen Order Form (Terintegrasi Iframe)
  // ==========================================
  const OrderForm = () => {
    const iframeRef = useRef(null);

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const handleMessage = (e) => {
        if (e.origin === 'https://ebookviral.store') {
          // Handle URL Redirect
          try {
            new URL(e.data);
            window.location.href = e.data;
            return;
          } catch (_) {}

          // Handle Resize
          try {
            const parsed = JSON.parse(e.data);
            if (typeof parsed === 'object' && parsed !== null) {
              if (parsed.type === 'resize') {
                iframe.style.height = parsed.height + 'px';
              }
            }
          } catch (err) {}
        }
      };

      window.addEventListener('message', handleMessage, false);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            iframe.src = iframe.src;
            observer.disconnect();
          }
        });
      });

      observer.observe(iframe);

      return () => {
        window.removeEventListener('message', handleMessage, false);
        observer.disconnect();
      };
    }, []);

    return (
      <div id="order" className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Selesaikan Pembayaran Kamu</h2>
            <p className="text-gray-400">Isi form di bawah ini untuk mendapatkan akses instan ke seluruh konten eksklusif.</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <iframe 
              ref={iframeRef}
              id="myiframe" 
              width="100%" 
              frameBorder="0" 
              src="https://ebookviral.store/formfd-duplicated-1"
              style={{ minHeight: '500px', transition: 'height 0.3s ease' }}
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  // Komponen Navigasi
  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLoggedIn(false)}>
            <Crown className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {CONFIG.namaWebsite}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {!isLoggedIn ? (
              <>
                <a href="#kreator" className="text-gray-300 hover:text-white transition">Kreator</a>
                <a href="#harga" className="text-gray-300 hover:text-white transition">Paket VIP</a>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Login / Daftar
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Cari video atau kreator..." 
                    className="bg-gray-900 border border-gray-700 text-white text-sm rounded-full focus:ring-pink-500 focus:border-pink-500 block w-64 pl-10 p-2.5 outline-none transition"
                  />
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-400 hover:text-white transition flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Keluar
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4">
          {!isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <a href="#kreator" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Kreator</a>
              <a href="#harga" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Paket VIP</a>
              <button 
                onClick={() => { setIsLoggedIn(true); setIsMobileMenuOpen(false); }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                Login
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:text-white w-full text-left flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Keluar
            </button>
          )}
        </div>
      )}
    </nav>
  );

  // Tampilan Halaman Utama (Landing Page)
  const LandingPage = () => (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-8">
            <Star className="w-4 h-4 fill-current" /> Konten Eksklusif 18+ Tahun Keatas
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            {CONFIG.tagline.split(' ').slice(0, 3).join(' ')} <br/>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              {CONFIG.tagline.split(' ').slice(3).join(' ')}
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {CONFIG.deskripsi}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2"
            >
              Mulai Nonton Sekarang <ChevronRight className="w-5 h-5" />
            </button>
            <a 
              href="#kreator"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition border border-gray-700 flex items-center justify-center"
            >
              Lihat Kreator
            </a>
          </div>
        </div>
      </div>

      {/* Kreator Section */}
      <div id="kreator" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Selebgram Populer Minggu Ini</h2>
            <p className="text-gray-400 mb-6">Subscribe ke mereka untuk membuka semua video rahasia.</p>
            
            {/* Tombol Tambah Kreator (Fitur Upload) */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="admin-only bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-full font-semibold transition border border-gray-700 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5 text-pink-500" /> Tambah Kreator Baru
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Menggunakan daftar selebList yang dinamis */}
            {selebList.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-16 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center">
                <User className="w-16 h-16 text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Belum Ada Kreator</h3>
                <p className="text-gray-500">Klik tombol "+ Tambah Kreator Baru" di atas untuk menambahkan kreator pertamamu!</p>
              </div>
            ) : (
              selebList.map((seleb) => (
                <div key={seleb.id} className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-800/50">
                  <div className="aspect-[4/5]">
                    <img src={seleb.foto} alt={seleb.nama} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {seleb.nama} <Check className="w-4 h-4 text-blue-400 bg-blue-400/20 rounded-full p-0.5" />
                    </h3>
                    <p className="text-pink-400 font-medium mb-2">{seleb.username}</p>
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>{seleb.pengikut} Followers</span>
                      <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full transition">Lihat Profil</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Video Singkat 9:16 Section */}
      <div id="shorts" className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Video Eksklusif Terkini</h2>
            <p className="text-gray-400 mb-6">Tonton bocoran aktivitas dari HP kreator favoritmu (Format 9:16).</p>
            
            {/* Tombol Tambah Video (Maks 5) */}
            {shortsList.length < 5 && (
              <button 
                onClick={() => setShowAddShortModal(true)}
                className="admin-only bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-full font-semibold transition border border-gray-700 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5 text-pink-500" /> Tambah Video Singkat ({shortsList.length}/5)
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {shortsList.length === 0 ? (
              <div className="w-full max-w-2xl text-center py-16 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center">
                <Film className="w-16 h-16 text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Belum Ada Video</h3>
                <p className="text-gray-500">Tambahkan video vertikal (Maksimal 5 buah).</p>
              </div>
            ) : (
              shortsList.map((short) => (
                <div key={short.id} className="relative w-full max-w-[260px] sm:w-[260px] aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800 bg-black group shadow-xl flex-shrink-0">
                  <video 
                    src={short.videoUrl} 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  ></video>
                  <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <h4 className="text-white font-bold text-sm line-clamp-2">{short.judul}</h4>
                    {short.namaSeleb && <p className="text-pink-400 text-xs font-medium mt-1">{short.namaSeleb}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="harga" className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pilih Paket Akses VIP Kamu</h2>
            <p className="text-gray-400">Bayar sekali, nikmati seumur hidup. Akses instan setelah pembayaran.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CONFIG.paket.map((pkt, index) => (
              <div key={index} className={`relative rounded-3xl bg-black border ${pkt.rekomendasi ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.15)]' : 'border-gray-800'} p-8 flex flex-col`}>
                {pkt.rekomendasi && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Paling Laris
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{pkt.nama}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{pkt.harga}</span>
                  <span className="text-gray-500">{pkt.durasi}</span>
                </div>
                <ul className="flex-1 space-y-4 mb-8">
                  {pkt.fitur.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-pink-500" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-4 rounded-xl font-bold transition ${pkt.rekomendasi ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                  Pilih Paket Ini
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bagian Order Form Ditambahkan di Sini */}
      <OrderForm />
    </div>
  );

  // Tampilan Dashboard Video (Setelah Login)
  const Dashboard = () => (
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Welcome */}
        <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Selamat datang kembali, VIP! 👑</h2>
            <p className="text-gray-400">Ada 3 video eksklusif baru dari seleb favoritmu hari ini.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition border border-white/10 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Upgrade ke VVIP
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-pink-500" /> Feed Eksklusif Terbaru
          </h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium">Semua</button>
            <button className="px-4 py-2 bg-gray-900 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition">Unlocked</button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONFIG.videoList.map((video) => (
            <div key={video.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group">
              <div className="relative aspect-video">
                <img src={video.thumbnail} alt={video.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-pink-500/90 flex items-center justify-center backdrop-blur-sm">
                    {video.premium ? <Lock className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                  </div>
                </div>
                {video.premium ? (
                  <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-lg">
                    <Lock className="w-3 h-3" /> VIP ONLY
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-lg">
                    <Unlock className="w-3 h-3" /> UNLOCKED
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-pink-400 text-sm font-semibold mb-2">{video.seleb}</p>
                <h4 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug">{video.judul}</h4>
                <button className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
                  video.premium 
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}>
                  {video.premium ? <><Lock className="w-4 h-4"/> Buka Akses Video Ini</> : <><Play className="w-4 h-4"/> Tonton Sekarang</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div id="main-app-container" className="min-h-screen bg-black font-sans selection:bg-pink-500 selection:text-white relative">
      <Navbar />
      
      {/* Logika penentuan halaman */}
      {isLoggedIn ? <Dashboard /> : <LandingPage />}

      {/* Tombol Download HTML Melayang */}
      <button 
        onClick={handleDownloadHTML}
        className="admin-only fixed bottom-8 right-8 z-40 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 group"
      >
        <Download className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
          Download File HTML
        </span>
      </button>

      {/* ========================================== */}
      {/* MODAL POP-UP UNTUK UPLOAD FOTO & ISI DATA  */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="admin-only fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100 transition-transform">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-black/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-pink-500" /> Tambah Kreator
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSeleb} className="p-6 flex flex-col gap-4">
              
              {/* Area Upload Foto Interaktif */}
              <div className="flex flex-col items-center justify-center w-full mb-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-800/30 hover:bg-gray-800/80 transition overflow-hidden relative group">
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">Ganti Foto</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="mb-1 text-sm text-gray-300 font-semibold">Klik untuk Upload Foto Kreator</p>
                      <p className="text-xs text-gray-500">Maks. 5MB (JPG, PNG)</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nama Selebgram <span className="text-pink-500">*</span></label>
                <input 
                  type="text" required
                  value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-black border border-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                  placeholder="Contoh: Anya Geraldine"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username IG/TikTok</label>
                  <input 
                    type="text" 
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-black border border-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="@username"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Jumlah Followers</label>
                  <input 
                    type="text" 
                    value={formData.pengikut} onChange={(e) => setFormData({...formData, pengikut: e.target.value})}
                    className="w-full bg-black border border-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="Contoh: 5.2M"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!formData.nama || !formData.foto}
                className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition"
              >
                Simpan & Tampilkan Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL POP-UP UNTUK UPLOAD VIDEO SINGKAT    */}
      {/* ========================================== */}
      {showAddShortModal && (
        <div className="admin-only fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100 transition-transform">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-black/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-pink-500" /> Tambah Video Singkat
              </h3>
              <button onClick={() => setShowAddShortModal(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddShort} className="p-6 flex flex-col gap-4">
              {/* Area Upload Video */}
              <div className="flex flex-col items-center justify-center w-full mb-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-800/30 hover:bg-gray-800/80 transition overflow-hidden relative group">
                  {shortFormData.videoUrl ? (
                    <>
                      <video src={shortFormData.videoUrl} className="w-full h-full object-cover absolute inset-0" muted></video>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">Ganti Video</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="mb-1 text-sm text-gray-300 font-semibold">Upload Video (9:16)</p>
                      <p className="text-xs text-gray-500">Maksimal 50MB (MP4/WebM)</p>
                    </div>
                  )}
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Judul / Caption Video <span className="text-pink-500">*</span></label>
                <input 
                  type="text" required
                  value={shortFormData.judul} onChange={(e) => setShortFormData({...shortFormData, judul: e.target.value})}
                  className="w-full bg-black border border-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                  placeholder="Contoh: Behind the scene photoshoot"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nama Selebgram (Opsional)</label>
                <input 
                  type="text" 
                  value={shortFormData.namaSeleb} onChange={(e) => setShortFormData({...shortFormData, namaSeleb: e.target.value})}
                  className="w-full bg-black border border-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                  placeholder="Contoh: Anya Geraldine"
                />
              </div>

              <button 
                type="submit"
                disabled={!shortFormData.judul || !shortFormData.videoUrl}
                className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition"
              >
                Simpan Video
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Crown className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold text-white">{CONFIG.namaWebsite}</span>
          </div>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Platform eksklusif untuk konten premium kreator favorit Anda. Berlangganan sekarang untuk mendapatkan akses tanpa batas.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-pink-500 transition">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-pink-500 transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-pink-500 transition">Bantuan</a>
          </div>
          <p className="text-gray-700 text-xs mt-8">
            &copy; 2024 {CONFIG.namaWebsite}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}