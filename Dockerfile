FROM node:22-alpine
RUN mkdir -p /app
WORKDIR /app
RUN npm install express@5 --omit=dev
COPY . /app
