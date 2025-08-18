"use client"
import { useState, useEffect } from "react";
import { PlusIcon, X, Upload, Instagram } from "lucide-react";
import Image from "next/image";

export default function Create({ onPostCreated }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("0");
    const [igLink, setIgLink] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setMessage("กรุณาใส่ข้อความ");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('tag', tag);
            if (igLink.trim()) {
                formData.append('igLink', igLink.trim());
            }
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage("โพสต์สำเร็จ!");
                // Reset form
                setContent("");
                setTag("0");
                setIgLink("");
                setImage(null);
                setImagePreview(null);
                // Close modal after 1 second
                setTimeout(() => {
                    setIsOpen(false);
                    setMessage("");
                    // Call callback to refresh posts
                    if (onPostCreated) {
                        onPostCreated();
                    }
                }, 1000);
            } else {
                setMessage("เกิดข้อผิดพลาด: " + data.error);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setContent("");
        setTag("0");
        setIgLink("");
        setImage(null);
        setImagePreview(null);
        setMessage("");
    };

    return (
        <div className="fixed top-0 right-0 w-[100vw] h-[100vh] bg-transparent pointer-events-none">
            {!isOpen && (
                <button 
                    className="fixed flex justify-center items-center bottom-10 right-10 w-[50px] h-[50px] bg-black/10 rounded-full pointer-events-auto z-50 shadow-lg hover:bg-gray-100 transition-colors" 
                    onClick={() => setIsOpen(true)}
                >
                    <PlusIcon className="w-6 h-6 text-black" />
                </button>
            )}
            
            {isOpen && (
                <div className="fixed top-0 right-0 w-[100vw] h-[100vh] bg-black/90 flex flex-col justify-center items-center pointer-events-auto">
                    <button 
                        className="fixed top-10 right-10 w-[50px] h-[50px] bg-white  rounded-full flex items-center justify-center z-50 hover:bg-gray-100 transition-colors" 
                        onClick={closeModal}
                    >
                        <X className="w-6 h-6 text-black" />
                    </button>
                    
                    <div className="w-[90vw] max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                        <h2 className="!text-white text-xl font-bold text-center mb-6">สร้างโพสต์ใหม่</h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Content Input */}
                            <div>
                                <textarea 
                                    className="w-full h-[100px] bg-white/20  placeholder-black/70 rounded-xl p-4 resize-none border border-white/30 focus:outline-none focus:border-white/50"
                                    placeholder="พิมพ์ฝากบอก..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={500}
                                    required
                                />
                                <div className="!text-white/60 text-sm text-right mt-1">
                                    {content.length}/500
                                </div>
                            </div>

                            {/* IG Link Input */}
                            <div>
                                <label className="block !text-white text-sm font-medium mb-2">
                                    แปะลิงค์ IG , อื่นๆ (ไม่บังคับ)
                                </label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 !text-white/50 w-5 h-5" />
                                    <input 
                                        type="url"
                                        className="w-full h-[50px] bg-white/20 text-white placeholder-black/70 rounded-xl pl-12 pr-4 border border-white/30 focus:outline-none focus:border-white/50"
                                        placeholder="https://instagram.com/username"
                                        value={igLink}
                                        onChange={(e) => setIgLink(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block !text-white text-sm font-medium mb-2">
                                    รูปภาพ (ไม่บังคับ)
                                </label>
                                <div className="relative">
                                    <input 
                                        className="hidden" 
                                        type="file" 
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <label 
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center w-full h-[120px] bg-white/20 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/30 transition-colors"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <Image 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center !text-white/70">
                                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                                <div>คลิกเพื่อเลือกรูปภาพ</div>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {image && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="text-red-400 text-sm mt-2 hover:text-red-300"
                                    >
                                        ลบรูปภาพ
                                    </button>
                                )}
                            </div>

                            {/* Tag Selection */}
                            <div>
                                <label className="block !text-white text-sm font-medium mb-2">
                                    ชั้นที่เกี่ยวข้อง (ไม่บังคับ)
                                </label>
                                <select 
                                    className="w-full h-[50px] bg-white/20 text-white rounded-xl px-4 border border-white/30 focus:outline-none focus:border-white/50"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                >
                                    <option className="text-black " value="0">เลือกชั้น</option>
                                    <option className="text-black " value="1">ม.1</option>
                                    <option className="text-black " value="2">ม.2</option>
                                    <option className="text-black " value="3">ม.3</option>
                                    <option className="text-black " value="4">ม.4</option>
                                    <option className="text-black " value="5">ม.5</option>
                                    <option className="text-black " value="6">ม.6</option>
                                </select>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`text-center p-3 rounded-lg ${
                                    message.includes("สำเร็จ") 
                                        ? "bg-green-500/20 text-green-300" 
                                        : "bg-red-500/20 text-red-300"
                                }`}>
                                    {message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-[50px] bg-black !text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "กำลังส่ง..." : "ส่งโพสต์"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}