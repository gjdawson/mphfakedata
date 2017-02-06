FROM mhart/alpine-node:7.5.0

WORKDIR /app
COPY . /app
RUN npm install

CMD /app/run.sh