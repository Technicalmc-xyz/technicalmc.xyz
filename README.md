# Technical Minecraft Wiki

![book](book.png)

# Find us
[technicalmc.xyz](https://technicalmc.xyz)

[Discord Server](https://discord.gg/FcTFg2E)

# Mission
The mission for the Technical Minecraft Wiki is to gather everyone's information into one spot. We believe this will significantly better the community by making it easier for new players to start exploring the world of technical minecraft.

# Contribute
By far, the best way to contribute to the wiki is to write and edit content. While the wiki is relatively new, only time can help fill in the holes and cracks of missing content. With your help we can write everything there is to know about minecraft, from the simplest mechanics to some of the most out of this world ideas and theory.

While this site is not even a year old it is still full of bugs and has been many revisions and complete rebuilds. As a result, there are bound to be issues, bugs, and features that need to be added. If you would like to help code these, please `@devs` in the Technical Minecraft Wiki Discord. While the code bases are kept private right now so that we can reduce the risks of attacks, you can get access to it if you would like to contribute.

The site is run completely out of Jakku's pocket and although he is glad to run it, donations are greatly appreciated and can be donated to him through his stream elements tip link.All donations go directly to sever hosting for the website. Although you do not have to donateto use the site donations greatly help keep this project alive.

# Consider Funding Us
[Donate via coindrop](https://coindrop.to/technicalmc-xyz)

[Donate via streamelemnts](https://streamelements.com/jjakuu/tip)

# Web Development

## Web development start

```
npm install
```

```
npm run dev
```

# Api Development

_Complete the prerequisites before running the api!_

## Development mode

```
cargo run --bin main
```

## Release mode

```
ROCKET_SECRET_KEY="$(openssl rand -base64 32)" cargo run --bin main --release
```

## Prerequisites

### Install

#### 1. Rust

[Install nightly with rustup](https://rustup.rs/). _It is important that
you are using the nightly toolchain_. To install nightly once you have  
installed rustup you can run

```
rustup toolchain install nightly
```

and then to make nightly your default toolchain

```
rustup default nightly
```

Additionally make sure that you have installed gcc for the rust complier. If you are on linux you can run - adjust per distro.

```
install build-essential
```

#### 2. Install Postgres

To make sure that diesel works you need to install the postgres server; instructions [here](https://www.postgresql.org/download/)

#### 2. To install Diesel ORM

```
cargo install diesel_cli --no-default-features --features postgres
```

More instrunctions on how to install diesel [here](https://diesel.rs/guides/getting-started)

### Install Podman

Install podman, see [here](https://podman.io/getting-started/installation).

We use podman to run the postgres container. If you would like to docker there is litteraly no differnce in how you
run commands, excpet for a few minor differnces. If you you use docker you will not need a pod created, and therefore also dont have to add the `--pod` argument to the command to run the docker container.

## Database Startup

#### Use the database script to start and run the postgres container with podman

```
chmod +x database.sh

./database.sh
```

#### Manually start podman/ docker containers

Create a pod with the ports 5432 exposed on the host and the container

```
podman pod create -n tmc-wiki-pod -p 5432:5432
```

Run the postgres image

```
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v pgdata:/var/lib/postgresql/data postgres
```

### Setup

After you have installed everything, yes it can be a lot if you dont have any of it installed.

In the `/api` directory initialize the database

```
diesel setup
```
#### Config files
These files are not added to the git, on purpose, so you have to create them yourself. They are the files
that configure things like the address of the postgres server and the discord auth links.

##### Rocket.toml
Create a `Rocket.toml` inside of `/api`

You may copy the `Example.rocket.toml` file into Rocket.toml

##### .env
Create a `.env` file inside of `/api`

You may copy `.env.example` file into `.env` and fill out the remaining arguments

Finally create the articles directory inside of `/api`

#### Create the articles dir
```
mkdir articles && cd articles
```

then make the articles directory a git directory with

```
git init
```

#### Start!
Lastly you can start the rust api with

```
cargo run --bin main
```

#### Optional - If you would like to connect to the database to run SQL

```
podman exec -it postgres-wiki bash

psql -h localhost -p 5432 -U user -d wiki -W
```

## Frameworks and tools

[Rocket http server](https://rocket.rs/)

[Diesel ORM](https://diesel.rs/)

[Nextjs]("https://nextjs.org/")

## Notes

If you thought this was confusing, consdier helping out and submitting a pull request to improve the wiki!