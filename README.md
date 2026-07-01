This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## CI – Validação da Spec OpenAPI

A validação automática da especificação OpenAPI é feita via GitHub Actions. O workflow verifica a spec a cada push ou Pull Request que altera arquivos `swagger*.yaml`.

![API Spec CI](https://github.com/<owner>/<repo>/actions/workflows/api-spec.yml/badge.svg)

**Workflow:** `.github/workflows/api-spec.yml`

```yaml
name: API Spec Validation

on:
  push:
    paths:
      - 'swagger*.yaml'
  pull_request:
    paths:
      - 'swagger*.yaml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install swagger-cli
        run: npm install -g swagger-cli
      - name: Validate OpenAPI spec
        run: swagger-cli validate swagger.v2.yaml
```
