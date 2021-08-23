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
```
npm install
```

```
npm run dev
```


# Api Development
*Complete the setup before running the api!*
## Development mode
```
ROCKET_SECRET_KEY="$(openssl rand -base64 32)" cargo run --bin main
```
## Release mode
```
ROCKET_SECRET_KEY="$(openssl rand -base64 32)" cargo run --bin main --release
```

## Setup

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

Once you have installed podman successfully, you can run the container 
pod with the following command:

```
podman play kube tmc-wiki-pod.yaml
```

### Manually start podman containers
If you would like to start the containers manually you can do that with:
```
podman pod create -n tmc-wiki-pod -p 5432:5432
```

Check to see that the pod was created:
```
podman ps -a --pod
```

Run the postgrest server
```
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v pgdata:/var/lib/postgresql/data postgres
```

### Start backup database container
If you would like to run the backup container you must also add the port 
mapping to the pod, which can only be done when the pod is created. 

```
podman pod create -n tmc-wiki-pod -p 5432:5432,8080:8080
```

Check to see that the pod was created:
```
podman ps -a --pod
```

Run the postgrest server:
```
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v pgdata:/var/lib/postgresql/data postgres
```
```
podman run --pod tmc-wiki-pod --rm -u postgres:postgres -e POSTGRES_HOST=postgres-wiki -e POSTGRES_DB=wiki -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e prodrigestivill/postgres-backup-local
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