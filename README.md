# Trade Fast

## Playwright

### Record test

```bash
 npx playwright codegen http://localhost:3000
```

docker build -t allanweber/tradefastapp:latest -f docker/Dockerfile .
docker run --name app -p 3000:3000 allanweber/tradefastapp:latest
docker-compose -f "docker/docker-compose.yml" up
docker-compose -f "docker/docker-compose.yml" down

KINDE_CLIENT_ID=xxxxx docker-compose -f "docker/docker-compose.yml" up
