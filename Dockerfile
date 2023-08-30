FROM node:latest as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app

RUN npm set strict-ssl false
RUN npm install
FROM nginx:latest
COPY --from=build /usr/local/app/dist/nice-to-meal-you /usr/share/nginx/html

RUN ["chmod", "+x", "/docker-entrypoint.sh"]

EXPOSE 80