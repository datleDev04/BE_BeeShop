export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác Minh Email Của Bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Xác Minh Email Của Bạn</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Cảm ơn bạn đã đăng ký! Mã xác minh của bạn là:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">{verificationCode}</span>
    </div>
    <p>Nhập mã này trên trang xác minh để hoàn tất đăng ký của bạn.</p>
    <p>Mã này sẽ hết hạn sau 15 phút vì lý do bảo mật.</p>
    <p>Nếu bạn không tạo tài khoản với chúng tôi, vui lòng bỏ qua email này.</p>
    <p>Trân trọng,<br>Beemelly Store.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;
export const VERIFIED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác Minh Email Thành Công!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Xác Minh Email Thành Công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào {name},</p>
    <p>Chúng tôi rất vui mừng thông báo rằng địa chỉ email của bạn đã được xác minh thành công.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #1e293b; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Bây giờ bạn có thể hoàn toàn tận hưởng tất cả các tính năng của ứng dụng của chúng tôi.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ thêm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
    <p>Trân trọng,<br>Beemelly Store.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt Lại Mật Khẩu Thành Công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt Lại Mật Khẩu Thành Công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Chúng tôi viết thư này để xác nhận rằng mật khẩu của bạn đã được đặt lại thành công.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #1e293b; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng liên hệ ngay với đội ngũ hỗ trợ của chúng tôi.</p>
    <p>Vì lý do bảo mật, chúng tôi khuyến nghị bạn:</p>
    <ul>
      <li>Sử dụng mật khẩu mạnh, duy nhất</li>
      <li>Kích hoạt xác thực hai yếu tố nếu có thể</li>
      <li>Tránh sử dụng cùng một mật khẩu trên nhiều trang web</li>
    </ul>
    <p>Cảm ơn bạn đã giúp chúng tôi giữ an toàn cho tài khoản của bạn.</p>
    <p>Trân trọng,<br>Beemelly Store.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt Lại Mật Khẩu Của Bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt Lại Mật Khẩu</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    <p>Để đặt lại mật khẩu của bạn, hãy nhấp vào nút dưới đây:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #1e293b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt Lại Mật Khẩu</a>
    </div>
    <p>Liên kết này sẽ hết hạn sau 1 giờ vì lý do bảo mật.</p>
    <p>Trân trọng,<br>Beemelly Store.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;

export const ORDER_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt Hàng Thành Công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt Hàng Thành Công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào {name},</p>
    <p>Cảm ơn bạn đã đặt hàng tại Beemelly Store!</p>
    <p>Đơn hàng của bạn đã được xác nhận và đang trong quá trình xử lý. Thông tin chi tiết đơn hàng của bạn như sau:</p>
    <ul>
      <li><strong>Số đơn hàng:</strong> {orderNumber}</li>
      <li><strong>Ngày đặt hàng:</strong> {orderDate}</li>
      <li><strong>Phương thức thanh toán:</strong> {paymentMethod}</li>
      <li><strong>Địa chỉ giao hàng:</strong> {shippingAddress}</li>
      <li><strong>Tổng tiền:</strong> {totalPrice}</li>
    </ul>
    <p><strong>Chi tiết sản phẩm:</strong></p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #1e293b; color: white;">
          <th style="padding: 10px; border: 1px solid #ddd;">Hình ảnh</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Tên sản phẩm</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Giá</th>
        </tr>
      </thead>
      <tbody>
        {orderItems}
      </tbody>
    </table>
    <p>Bạn có thể theo dõi trạng thái đơn hàng của mình bằng cách truy cập vào trang tài khoản của bạn trên website của chúng tôi.</p>
    <p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ thêm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
    <p>Trân trọng,<br>Beemelly Store.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;

export const generateOrderSuccessEmailTemplate = (order) => {
  const orderItemsFormatted = order.items.map((item) => ({
    name: item.product.name,
    image: item.product.thumbnail,
    quantity: item.quantity,
    price: item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
  }));

  const orderDate = new Date().toLocaleDateString('vi-VN');
  const price = order.total_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const orderItemsHtml = generateOrderItemsTable(orderItemsFormatted);

  const emailHtml = ORDER_SUCCESS_TEMPLATE.replace('{orderItems}', orderItemsHtml)
    .replace('{name}', order.user_name)
    .replace('{orderNumber}', order.unique_id)
    .replace('{orderDate}', orderDate)
    .replace(
      '{paymentMethod}',
      order.payment_type === 'payos' ? 'Thanh toán bằng Payos' : 'Thanh toán bằng VnPay'
    )
    .replace('{shippingAddress}', order.shipping_address)
    .replace('{totalPrice}', price);

  return emailHtml;
};

export const generateOrderItemsTable = (products) => {
  return products
    .map(
      (product) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">
        <img src="${product.image}" alt="${product.name}" style="max-width: 100px;">
      </td>
      <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${product.price}</td>
    </tr>
  `
    )
    .join('');
};

export const getChangeOrderStatusTemplate = (userName, orderStatus, orderId) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cập Nhật Trạng Thái Đơn Hàng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1e293b;
      color: #fff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .content h2 {
      color: #1e293b;
    }
    .status {
      text-align: center;
      font-size: 18px;
      margin: 20px 0;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    .status.pending {
      color: #FFA500;
    }
    .status.processing {
      color: #007BFF;
    }
    .status.delivering {
      color: #17A2B8;
    }
    .status.delivered {
      color: #28A745;
    }
    .status.cancelled {
      color: #DC3545;
    }
    .order-details {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
    }
    .order-details th,
    .order-details td {
      padding: 10px;
      text-align: left;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
      padding: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Beemely Store</div>
    
    <div class="content">
      <h2>Cập Nhật Trạng Thái Đơn Hàng</h2>
      <p>Xin chào ${userName},</p>
      <p>Chúng tôi muốn thông báo rằng trạng thái đơn hàng của bạn đã được cập nhật. Dưới đây là chi tiết mới nhất:</p>

      <div class="status">
        <strong>Trạng Thái Hiện Tại: ${orderStatus}</strong>
      </div>

      <table class="order-details" width="100%">
        <tr>
          <th>Mã Đơn Hàng:</th>
          <td>${orderId}</td>
        </tr>
      </table>
      
      <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi bất cứ lúc nào.</p>
      <p>Cảm ơn bạn đã mua sắm tại Beemely Store!</p>
    </div>

    <div class="footer">
      Beemely Store, 123 Business Rd, Business City, BC 12345 <br>
      &copy; 2024 Beemely Store. Tất cả các quyền được bảo lưu.
    </div>
  </div>
</body>
</html>
`;
