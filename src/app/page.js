'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, User, Clock } from 'lucide-react';
import Image from 'next/image';

const posts = [
  { id: 1, content: 'สวัสดีครับ ผมชื่อ นายห่วย นามสกุลไม่ได้เรื่อง แมวที่บ้านไม่ได้มี กินข้าวฟรีครับ' , tag: '1' , src : '/upload/2.png'},
  { id: 2, content: 'โพสต์ที่ 2', tag: '2' , src : '/upload/2.png'},
  { id: 3, content: 'โพสต์ที่ 3' , tag: '3' , src : '/upload/2.png'},
];

export default function TiktokStyle() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleSwipe = (direction) => {
    if (direction === 'up' && index < posts.length - 1) {
      setIndex(index + 1);
      setLiked(false);
    }
    if (direction === 'down' && index > 0) {
      setIndex(index - 1);
      setLiked(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={posts[index].id}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.y < -100) handleSwipe('up');
            else if (info.offset.y > 100) handleSwipe('down');
          }}
          className="h-screen w-full absolute flex items-center justify-center p-6"
        >
          <div className="flex flex-col justify-center items-center max-w-md mx-auto space-y-6">
            {/* Grade Badge */}
            <motion.div 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <User size={16} />
              ชั้น ม.{posts[index].tag}
            </motion.div>

            {/* Main Content Card */}
            <motion.div 
              className="flex flex-col justify-center items-start gap-5 w-[80vw] h-max max-h-[80vh] min-h-[40vh] bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className='flex flex-row  w-full h-max gap-2'>
                <Image  src={posts[index].src} alt="post" width={100} height={100} className='object-cover min-w-[50px] min-h-[50px] w-[50px] h-[50px] rounded-full self-start' />
                <div className='flex flex-row  w-max h-max'>
                    
                  <div className="text-start bg-black/10 text-white p-5 rounded-xl text-xl leading-relaxed">{posts[index].content}</div>
              
                </div>
              </div>
              
              <Image  src={'/upload/3.png'} alt="post" width={500} height={500} className='object-contain w-[100px] h-auto rounded-xl self-start' />
            </motion.div>

            {/* Interaction Buttons */}
            <motion.div 
              className="flex justify-center items-center gap-4 w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  liked 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={30} fill={liked ? 'currentColor' : 'none'} />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300">
                <MessageCircle size={30} />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300">
                <Share2 size={30} />
                <span className="text-sm font-medium">แชร์</span>
              </button>
            </motion.div>

            {/* Instagram Link */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-white/70 text-sm">
                ลิงค์ IG: <span className="text-blue-300 font-medium">@somsai</span>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
            <div className="text-white/60 text-xs">เลื่อนเพื่อดูต่อ</div>
            <div className="w-1 h-8 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="w-full bg-white/60 rounded-full transition-all duration-300"
                style={{ height: `${((index + 1) / posts.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}