FROM simplicityitself-muon-image.jfrog.io/node:7

WORKDIR /applocal
COPY . /applocal

CMD ./run.sh