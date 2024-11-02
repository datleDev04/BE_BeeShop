function generateOrderUniqueID() {
  const timestamp = Date.now().toString().slice(-5); // Lấy 5 ký tự cuối của timestamp
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 ký tự ngẫu nhiên

  return `${timestamp}${randomPart}`;
}