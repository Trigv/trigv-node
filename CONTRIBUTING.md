# Contributing

Thank you for contributing to Trigv open-source tools.

## Development

```bash
npm install
npm test
npm run lint
npm run build
```

## Pull requests

1. Fork `Trigv/trigv-node` and create a feature branch from `main`
2. Keep changes focused; match existing code style
3. Add or update tests for behaviour changes
4. Ensure `npm test`, `npm run lint`, and `npm run build` pass
5. Update `CHANGELOG.md` under **Unreleased** for user-visible changes

## API contract

Ingest behaviour must match [Trigv OpenAPI](https://api.trigv.com/openapi.yaml). Do not add fields or endpoints that are not in the specification.

## Security

Never commit API keys. Use `trgv_your_api_key` in examples.
