# Technical Minecraft Wiki
![book](book.png)

## Find us
[Discord Server](https://discord.gg/FcTFg2E)

[technicalmc.xyz](https://technicalmc.xyz)


# Mission
The mission for the Technical Minecraft Wiki is to gather everyone's information into one spot. We believe this will significantly better the community by making it easier for new players to start exploring the world of technical minecraft.

# Contribute
By far, the best way to contribute to the wiki is to write and edit content. While the wiki is relatively new, only time can help fill in the holes and cracks of missing content. With your help we can write everything there is to know about minecraft, from the simplest mechanics to some of the most out of this world ideas and theory.

While this site is not even a year old it is still full of bugs and has been many revisions and complete rebuilds. As a result, there are bound to be issues, bugs, and features that need to be added. If you would like to help code these, please `@devs` in the Technical Minecraft Wiki Discord. While the code bases are kept private right now so that we can reduce the risks of attacks, you can get access to it if you would like to contribute.

The site is run completely out of Jakku's pocket and although he is glad to run it, donations are greatly appreciated and can be donated to him through his stream elements tip link.All donations go directly to sever hosting for the website. Although you do not have to donateto use the site donations greatly help keep this project alive.


# Web Development
## Web development start
`npm install`

`npm run dev`


# Api Development
## First Startup

[Install nightly with rustup](https://rustup.rs/)

### Diesel ORM
Install Diesel ORM CLI
```
cargo install diesel_cli --no-default-features --features postgres
```

Run diesel setup
```
diesel setup
```

Run diesel migration
```
diesel migration run
```

## Database Startup
Install podman. See [here](https://podman.io/getting-started/installation).

1. `chmod +x start_podman`
2. `./start_podman`

### Manually start podman containers
```
podman pod create -n tmc-wiki-pod -p 8080:8080,5432:5432
```
```
podman ps -a --pod
```
```
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e 
```
```
POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v 
```
```
pgdata:/var/lib/postgresql/data postgres
```

### Start backup database container

```
podman run --pod tmc-wiki-pod --rm -u postgres:postgres -e 
```
```
POSTGRES_HOST=postgres-wiki -e POSTGRES_DB=wiki -e POSTGRES_USER=user -e 
```
```
POSTGRES_PASSWORD=pass -e prodrigestivill/postgres-backup-local
```

### Connect to the database to run SQL
```
docker exec -it postgres-wiki bash
```
```
psql -h localhost -p 5432 -U user -d wiki -W
```

### Frameworks and tools
[Rocket http server](https://rocket.rs/)

[Diesel ORM](https://diesel.rs/)