FROM node:latest



RUN mkdir /app
WORKDIR /app

COPY ["./package.json",  "./"]
RUN npm install

COPY src ./src

EXPOSE 80

CMD ["node", "src"]