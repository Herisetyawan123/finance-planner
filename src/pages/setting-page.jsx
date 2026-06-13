import React, { useState } from 'react'
import Card from '../components/cards';
import { useOutletContext } from 'react-router-dom';



// ===================== PENGATURAN =====================
const PengaturanPage = () => {
  const {darkMode, setDarkMode} = useOutletContext();
  const [profile, setProfile] = useState({nama:"Andi Pratama", email:"andi@email.com", telepon:"0812-3456-7890"});
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Profil Pengguna</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-2xl font-bold text-emerald-600 dark:text-emerald-400">{profile.nama.charAt(0)}</div>
          <div><div className="font-semibold text-gray-800 dark:text-gray-200">{profile.nama}</div><div className="text-sm text-gray-500">{profile.email}</div></div>
        </div>
        {["nama","email","telepon"].map(field=>(
          <div key={field} className="mb-3">
            <label className="text-xs text-gray-500 block mb-1 capitalize">{field}</label>
            <input value={profile[field]} onChange={e=>setProfile(p=>({...p,[field]:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/>
          </div>
        ))}
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl mt-2 transition-colors">Simpan Profil</button>
      </Card>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Preferensi</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div><div className="text-sm font-medium text-gray-800 dark:text-gray-200">Mode Gelap</div><div className="text-xs text-gray-400">Tampilan dark mode</div></div>
            <button onClick={()=>setDarkMode(d=>!d)} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode?"bg-emerald-500":"bg-gray-300 dark:bg-gray-600"}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${darkMode?"left-7":"left-1"}`}/>
            </button>
          </div>
          {[["Mata Uang","Rupiah Indonesia (IDR)"],["Bahasa","Indonesia"],["Format Tanggal","DD/MM/YYYY"]].map(([label,val])=>(
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div><div className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</div><div className="text-xs text-gray-400">{val}</div></div>
              <span className="text-xs text-gray-400">→</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Data & Backup</h2>
        <div className="grid grid-cols-2 gap-2">
          {[["↓ Backup Data","emerald"],["↑ Import Data","blue"],["📋 Export JSON","gray"],["🗑️ Reset Data","red"]].map(([label,color])=>(
            <button key={label} className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${color==="emerald"?"bg-emerald-500 hover:bg-emerald-600 text-white":color==="blue"?"bg-blue-500 hover:bg-blue-600 text-white":color==="red"?"bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>{label}</button>
          ))}
        </div>
      </Card>
    </div>
  );
};


export default PengaturanPage;
