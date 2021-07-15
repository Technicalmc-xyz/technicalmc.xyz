#!/bin/sh
podman pod create -n tmc-wiki-pod -p 5432:5432
# Run the postgres container
podman run -dt --pod tmc-wiki-pod \
    --rm \
    --name postgres-wiki \
    -e POSTGRES_PASSWORD=pass \
    -e POSTGRES_USER=user \
    -e POSTGRES_DB=wiki \
    -v pgdata:/var/lib/postgresql/data \
    postgres 