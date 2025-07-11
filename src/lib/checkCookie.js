export function getCookie(name) {
    // หา cookie ชื่อ name
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  
    return cookieValue || "not chosed"; // ถ้าไม่มี cookie คืน null
  }
  