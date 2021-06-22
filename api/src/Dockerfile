FROM rustlang/rust:nightly

RUN cargo install diesel_cli --no-default-features --features postgres

WORKDIR /usr/src/app

EXPOSE 8000

VOLUME ["/usr/local/cargo"]
