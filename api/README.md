# Technical Minecraft Wiki API - version 2.0
![book](book.png)

# First Start up
Install Diesel CLI
```console
cargo install diesel_cli --no-default-features --features postgres
```

Setup
```console
diesel setup
```

Run the migration
```console
diesel migration run
```

### Start the Database
To install podman see [here](https://podman.io/getting-started/installation).

1. `chmod +x start_podman`
2. `./start_podman`

**Manually start podman containers**
```console
podman pod create -n tmc-wiki-pod -p 8080:8080,5432:5432
podman ps -a --pod
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v pgdata:/var/lib/postgresql/data postgres
```
### Start backup database container
```console
podman run --pod tmc-wiki-pod --rm -u postgres:postgres -e POSTGRES_HOST=postgres-wiki -e POSTGRES_DB=wiki -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e prodrigestivill/postgres-backup-local
```

### Connect to the database to run SQL
```console
docker exec -it postgres-wiki bash

psql -h localhost -p 5432 -U user -d wiki -W
```

### Frameworks and tools
[Rocket http server](https://rocket.rs/)

[Diesel ORM](https://diesel.rs/)