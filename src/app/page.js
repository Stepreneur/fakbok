'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, User, Clock, CheckCircle, Instagram } from 'lucide-react';
import Image from 'next/image';
import Create from '@/components/Create/page';
import CommentsModal from '@/components/CommentsModal/page';
import ImageModal from '@/components/ImageModal/page';
import { useSearchParams } from 'next/navigation';
import TagModal from '@/components/TagModal/page';
import { getCookie } from '@/lib/checkCookie';
function TiktokStyleContent() {
  const [tagGrade, setTagGrade] = useState("not chosed");
  const [showChoseTagModal, setShowChoseTagModal] = useState(false);
  
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const searchParams = useSearchParams();
  const sharedPostId = searchParams.get('post');
  
 
  {/* check tag cookie */}
  useEffect(() => {
    const cookieTag = getCookie("tag");
    console.log(cookieTag)
    if(cookieTag == "not chosed"){
      setTagGrade("not chosed")
      // ไม่แสดง TagModal ทันที ให้แสดงเฉพาะเมื่อกดปุ่มไลค์หรือคอมเม้น
      setShowChoseTagModal(false)
      return
    } else if (cookieTag == 1 || 2 || 3 || 4 || 5 || 6){
      setTagGrade(cookieTag);
      setShowChoseTagModal(false)
    }
  }, []);

  // Handle TagModal close
  const handleTagModalClose = (selectedTag) => {
    setShowChoseTagModal(false);
    if (selectedTag) {
      setTagGrade(selectedTag);
      // Refresh posts with new tag
      fetchPosts(1, false, selectedTag);
    }
  };

  // Function to get random profile image
  const getRandomProfileImage = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return `/upload/${randomNumber}.png`;
  };

  // Fetch posts from API
  const fetchPosts = useCallback(async (page = 1, append = false, userTag = null) => {
    try {
      setLoading(true);
      // ส่ง userTag ไปยัง API ถ้ามี
      const tagParam = userTag || tagGrade;
      const url = tagParam && tagParam !== "not chosed" && tagParam !== "null" 
        ? `/api/posts?page=${page}&limit=10&userTag=${tagParam}`
        : `/api/posts?page=${page}&limit=10`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Add random profile images to posts
        const postsWithProfileImages = data.posts.map(post => ({
          ...post,
          profileImage: getRandomProfileImage()
        }));

        if (append) {
          setPosts(prev => [...prev, ...postsWithProfileImages]);
        } else {
          setPosts(postsWithProfileImages);
        }
        setHasMore(data.pagination.hasMore);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [tagGrade]);

  // Load initial posts
  useEffect(() => {
    // โหลดโพสต์เสมอ ไม่ว่าจะมี tag หรือไม่
    fetchPosts(1, false);
  }, [fetchPosts, tagGrade]);

  // Handle shared post
  useEffect(() => {
    if (sharedPostId && posts.length > 0) {
      const sharedIndex = posts.findIndex(post => post.id === parseInt(sharedPostId));
      if (sharedIndex !== -1) {
        setIndex(sharedIndex);
      }
    }
  }, [sharedPostId, posts]);

  // Load more posts when reaching the end
  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore && index >= posts.length - 2) {
      fetchPosts(currentPage + 1, true);
    }
  }, [loading, hasMore, index, posts.length, currentPage, fetchPosts, tagGrade]);

  const handleSwipe = (direction) => {
    if (direction === 'up' && index < posts.length - 1) {
      setIndex(index + 1);
      setLiked(false);
      // Load more posts if needed
      loadMorePosts();
    } else if (direction === 'up' && index === posts.length - 1 && !hasMore) {
      // Show end message when trying to swipe up from the last post
      setShowEndMessage(true);
    }
    
    if (direction === 'down' && index > 0) {
      setIndex(index - 1);
      setLiked(false);
      // Hide end message when going back
      setShowEndMessage(false);
    }
  };

  // Handle like
  const handleLike = async () => {
    if(tagGrade == "not chosed"){
      setShowChoseTagModal(true)
      return
    }
    if (likedPosts.has(posts[index]?.id)) {
      setLikedPosts(prev => new Set([...prev, posts[index]?.id]));
      setLiked(false);
      return;
    }
    const currentPost = posts[index];
    if (!currentPost) return;

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: currentPost.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setPosts(prev => prev.map(post => 
          post.id === currentPost.id 
            ? { ...post, likeCount: data.likeCount }
            : post
        ));
        setLikedPosts(prev => new Set([...prev, currentPost.id]));
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShowComment = async () => {
    if(tagGrade == "not chosed"){
      setShowChoseTagModal(true)
      return
    }else{
      setShowComments(true)
    }
  }

  // Handle share
  const handleShare = async () => {
    const currentPost = posts[index];
    if (!currentPost) return;

    const shareUrl = `${window.location.origin}?post=${currentPost.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ดูโพสต์นี้ใน FakBok',
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('คัดลอกลิงค์แล้ว!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle image click
  const handleImageClick = () => {
    const currentPost = posts[index];
    if (currentPost?.src) {
      setShowImageModal(true);
    }
  };

  // Refresh posts when new post is created
  const handleNewPost = () => {
    setIndex(0);
    setShowEndMessage(false);
    // Refresh posts with current tag
    fetchPosts(1, false);
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-4">ไม่มีโพสต์ใน 24 ชั่วโมงที่ผ่านมา</div>
          <div className="text-lg">สร้างโพสต์แรกของคุณเลย!</div>
        </div>
        <Create onPostCreated={handleNewPost} />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {loading && posts.length === 0 && (
        <div className="h-screen flex items-center justify-center">
          <div className="text-white text-xl">กำลังโหลดโพสต์...</div>
        </div>
      )}

      {posts.length > 0 && (
      <AnimatePresence initial={false}>
        <motion.div
            key={posts[index]?.id || index}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                posts[index]?.tag == tagGrade && tagGrade !== "not chosed"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 !text-white border-2 border-yellow-300 animate-pulse"
                  : "bg-gradient-to-r from-gray-500 to-gray-600 !text-white"
              }`}
            >
               {posts[index]?.tag == tagGrade && tagGrade !== "not chosed" && (
                      <span className="w-3 h-3 bg-yellow-300 rounded-full "></span>   
                  )}
              <User size={16} />
              {posts[index]?.tag == 0 ? (
                <span className='!text-white/90 text-sm'>ไม่มีแท็ก</span>
              ) : (
                <span className='!text-white/90 text-sm'>
                  ชั้น ม.{posts[index]?.tag || 0}
      
                </span>
              )}
            </motion.div>

            {/* Main Content Card */}
            <motion.div 
              className={`flex flex-col justify-center relative items-start gap-2 w-max h-max max-h-[80vh] pt-15 backdrop-blur-lg rounded-3xl p-6 shadow-2xl ${
                posts[index]?.tag == tagGrade && tagGrade !== "not chosed"
                  ? "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-yellow-300/50"
                  : "bg-gray-500/10 border border-gray-400/20"
              }`}
            >
            {/* Time ago indicator */}
                     <div className="flex items-center absolute top-5 right-5 gap-2 text-white/70 text-sm">
                      <Clock size={14} />
                      <span>{posts[index]?.timeAgo || 'ไม่ทราบเวลา'}</span>
                    </div>

                <div className='flex flex-row w-full h-max gap-2'>
                  {/* Profile Image - Random */}
                  <div 
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={handleImageClick}
                  >
                    <Image 
                      src={posts[index]?.profileImage || '/upload/1.png'} 
                      alt="profile" 
                      width={100} 
                      height={100} 
                      className='object-cover min-w-[50px] min-h-[50px] w-[50px] h-[50px] rounded-full self-start' 
                    />
                  </div>
                  <div className='flex flex-col w-full h-max gap-2'>
                    <div className="text-start bg-black/10 text-white p-5 rounded-xl text-xl leading-relaxed">
                      {posts[index]?.content || 'ไม่มีเนื้อหา'}
                    </div>
              
                   

                    {/* src */}
                    {posts[index]?.src && (
                      <div className='flex flex-row items-center gap-2 mt-2'>
                       <Image 
                        src={posts[index].src} 
                        alt="post" 
                        onClick={handleImageClick}
                        width={100} 
                        height={100} 
                        className='object-contain min-w-[50px] min-h-[50px] w-[50px] h-auto rounded-xl self-start pointer-events-auto' 
                      />
                      <span>กดเพื่อขยาย</span>
                      </div>
                    
                    )}
                  </div>
                </div>
            </motion.div>

            {/* Interaction Buttons */}
            <motion.div 
              className="flex justify-center items-center gap-4 w-full"
            >
              <button 
                  onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    likedPosts.has(posts[index]?.id) || liked
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                  <Heart size={30} fill={likedPosts.has(posts[index]?.id) || liked ? 'currentColor' : 'none'} />
                  {posts[index]?.likeCount >= 0 && (
                    <span className="text-sm font-medium">{posts[index].likeCount}</span>
                  )}
              </button>

                <button 
                  onClick={handleShowComment}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                >
                <MessageCircle size={30} />
                {posts[index]?.commentCount >= 0 && (
                    <span className="text-sm font-medium">{posts[index].commentCount}</span>
                  )}
              </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                >
                <Share2 size={30} />
                <span className="text-sm font-medium">แชร์</span>
              </button>
                
            </motion.div>
              {/* IG Link */}
              {posts[index]?.igLink && (
                      <a 
                        href={posts[index].igLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm transition-colors"
                      >
                        <Instagram size={24} />
                        <span>ลิงค์ที่ผู้ใช้แปะ</span>
                      </a>
                    )}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-50% flex flex-col items-center gap-2">
            <div className="text-white/60 text-xs">เลื่อนเพื่อดูต่อ</div>
            <div className="w-1 h-8 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="w-full bg-white/60 rounded-full transition-all duration-300"
                style={{ height: `${((index + 1) / posts.length) * 100}%` }}
              ></div>
            </div>
          </div>

            {/* Loading indicator for infinite scroll */}
            {loading && hasMore && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="text-white/60 text-sm">กำลังโหลดโพสต์เพิ่ม...</div>
              </div>
            )}

            {/* End message when trying to swipe beyond the last post */}
            {showEndMessage && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center shadow-2xl border border-white/30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="w-16 h-16 text-green-400" />
                  <div className="text-white">
                    <div className="text-xl font-bold mb-2">คุณเลื่อนมาครบแล้ว!</div>
                    <div className="text-sm opacity-80">โพสต์ทั้งหมดใน 24 ชั่วโมงที่ผ่านมา</div>
                  </div>
                  <button 
                    onClick={() => {
                      setIndex(0);
                      setShowEndMessage(false);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    ดูโพสต์แรก
                  </button>
                </div>
              </motion.div>
            )}
        </motion.div>
      </AnimatePresence>
      )}
      
      {/* Comments Modal */}
      <CommentsModal 
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={posts[index]?.id}
        post={posts[index]}
      />

      {/* Image Modal */}
      <ImageModal 
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={posts[index]?.src}
      />
      
      <Create onPostCreated={handleNewPost} />

      {showChoseTagModal && (
        <TagModal onClose={handleTagModalClose} />
      )}


    </div>
  );
}

export default function TiktokStyle() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    }>
      <TiktokStyleContent />
    </Suspense>
  );
}