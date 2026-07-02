# dotenv-seeder

A GitHub Action to seed environment variables into a env file by merging an example file with user-provided values in JSON format.
Useful for CI/CD pipelines or setting up local environments consistently.

## Features

- Flexible – Supports any file name or path, not just regular `.env` and `.env.example`
- Clean – Preserves structure, handles empty lines, and quotes values when needed
- Simple – No magic, no complex config — just JSON input and a reliable result

## Basic Usage

```yaml
name: CI Workflow

on: push

jobs:
  main:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v7

      - name: Seed environment variables
        uses: scrlkx/dotenv-seeder@v2
        with:
          example: ".env.example"
          target: ".env"
          variables: |
            {
              "API_KEY": "{{ secrets.API_KEY }}",
              "DEBUG": "true",
              "BASE_URL": "{{ env.BASE_URL }}"
            }
```

## Inputs

| Name          | Description                                                                                     | Required | Default        |
| ------------- | ----------------------------------------------------------------------------------------------- | -------- | -------------- |
| `mode`        | Seeding mode — see [Modes](#modes) below                                                        | No       | `copy-example` |
| `example`     | The example file to copy from if the target file does not exist                                 | No       | `.env.example` |
| `target`      | The environment file to update or create                                                        | No       | `.env`         |
| `variables`   | A JSON object containing environment variables to inject                                        | Yes      | —              |

## Modes

The `mode` input controls whether an example file is required to seed the target file.

### `copy-example` (default)

Copies `example` to `target` before applying `variables`. The example file must exist, or the action fails.

```yaml
with:
  mode: "copy-example" # optional, this is the default
  example: ".env.example"
  target: ".env"
  variables: |
    { "API_KEY": "{{ secrets.API_KEY }}" }
```

### `only-create`

Writes or updates `target` directly, without requiring or copying an example file. Use this when there is no `.env.example` to seed from.

```yaml
with:
  mode: "only-create"
  target: ".env"
  variables: |
    { "API_KEY": "{{ secrets.API_KEY }}" }
```

## License

GPL-3.0 License - see the [LICENSE](LICENSE) file for details
