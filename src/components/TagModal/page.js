"use client"
import { useState } from "react";

export default function TagModal({ onClose }) {
  const [tag, setTag] = useState("null"); 
  const [open, setOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tag === "null") {
      alert("กรุณาเลือก tag");
      return;
    }

    document.cookie = `tag=${tag}; path=/; max-age=2592000;`;
    alert(`ตั้งค่า tag = ${tag} เรียบร้อย`);
    setOpen(false); // ปิด modal หลังตั้งค่าเสร็จ
    
    // แจ้ง parent component ว่า modal ถูกปิดแล้ว
    if (onClose) {
      onClose(tag);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // แจ้ง parent component ว่า modal ถูกปิดแล้ว
    if (onClose) {
      onClose(null);
    }
  };

  return (
    <div>
      {open && (
        <div className="w-[100vw] h-[100vh] fixed top-0 left-0 flex items-center justify-center">
          <div className="w-[500px] bg-white rounded-2xl p-8 relative shadow-2xl border border-gray-100 transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">ให้เราช่วยกรองโพสต์ที่คุณสนใจ</h1>
              <p className="text-gray-600 text-sm">เลือกระดับชั้นที่คุณกำลังศึกษาอยู่</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ระดับชั้น
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-700"
                >
                  <option value="null">เลือกระดับชั้น</option>
                  <option value="1">มัธยม 1</option>
                  <option value="2">มัธยม 2</option>
                  <option value="3">มัธยม 3</option>
                  <option value="4">มัธยม 4</option>
                  <option value="5">มัธยม 5</option>
                  <option value="6">มัธยม 6</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">ข้อมูลของคุณจะถูกเก็บเป็นความลับ</span> และใช้เฉพาะเพื่อการกรองโพสต์เท่านั้น
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black !text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  เริ่มต้นกรองโพสต์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
