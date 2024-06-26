# Sử dụng image node phiên bản LTS làm base image
FROM node:lts

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép các file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependency từ package.json
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Expose cổng ${DEV_APP_PORT} của container
EXPOSE ${DEV_APP_PORT}

# Command để chạy ứng dụng khi container được start
CMD ["npm", "run", "dev"]