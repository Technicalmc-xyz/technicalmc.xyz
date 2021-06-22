podman pod create -n tmc-wiki-pod -p 8080:8080,5432:5432,
podman ps -a --pod
# Run the postgres container
podman run -dt --pod tmc-wiki-pod --rm --name postgres-wiki -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=wiki -v pgdata:/var/lib/postgresql/data postgres
# Run the backup server
#podman run --pod tmc-wiki-pod --rm -u postgres:postgres -e POSTGRES_HOST=postgres-wiki -e POSTGRES_DB=wiki -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e prodrigestivill/postgres-backup-local
