# Trade Fast

## Playwright

### Record test

```bash
 npx playwright codegen http://localhost:3000

 npx playwright codegen --viewport-size=375,667 http://localhost:3000

 npx playwright test --ui
```

docker build -t allanweber/tradefastapp:latest -f docker/Dockerfile .

KINDE_CLIENT_ID=xxxxx docker-compose -f "docker/docker-compose.yml" up
