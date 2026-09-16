# Docker Notes

Docker packages applications into **containers** — isolated environments that run anywhere.

## Images vs Containers

- **Image** — a read-only template (the recipe)
- **Container** — a running instance of an image (the cooked meal)

## Common Commands

```bash
# Build an image from a Dockerfile
docker build -t my-app .

# Run a container in the background
docker run -d -p 3000:3000 my-app

# List running containers
docker ps

# Stop and remove a container
docker stop <id> && docker rm <id>
```

## Docker Compose

Compose defines multi-service apps in a `docker-compose.yml`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: mongo:6
```

```bash
docker compose up -d
```

## Why Containers

- Same behavior on every machine — **no "works on my machine"**
- Lightweight vs virtual machines (share the host kernel)
- Easy to version, share, and deploy