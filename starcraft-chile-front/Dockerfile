
#stage 1
FROM node:18.19-alpine as node
WORKDIR /app
COPY . ./
RUN npm install
RUN npm install -g @angular/cli@16
RUN ng build
#stage 2
FROM nginx
COPY --from=node /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/starcraft-chile-front /usr/share/nginx/html

 