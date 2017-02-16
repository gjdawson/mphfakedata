FROM simplicityitself-muon-image.jfrog.io/node:7
RUN mkdir /applocal
COPY ./fakedata.js /applocal
COPY ./package.json /applocal
WORKDIR /applocal
RUN npm install
CMD ./node_modules/babel-cli/bin/babel-node.js fakedata.js