# dotenv-seeder

A GitHub Action to seed environment variables into a env file by merging an example file with user-provided values in JSON format. Useful for CI/CD pipelines or setting up local environments consistently.

## Features

- Flexible – Supports any file name or path, not just regular `.env` and `.env.example`
- Clean – Preserves structure, handles empty lines, and quotes values when needed
- Simple – No magic, no complex config — just JSON input and a reliable result

## Usage

```yaml
name: CI Workflow

on: push

jobs:
  main:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Seed environment variables
        uses: scrlkx/dotenv-seeder@v1
        with:
          target: ".env"
          example: ".env.example"
          variables: |
            {
              "API_KEY": "{{ secrets.API_KEY }}",
              "DEBUG": "true",
              "BASE_URL": "{{ env.BASE_URL }}"
            }
```

## Inputs

| Name          | Description                                                        | Required | Default        |
| ------------- | ------------------------------------------------------------------ | -------- | -------------- |
| `target`      | The environment file to update or create                           | No       | `.env`         |
| `example`     | The template file to copy from if the target file does not exist   | No       | `.env.example` |
| `variables`   | A JSON object containing environment variables to inject           | Yes      | —              |
| `skipExample` | If true, does not use the example file to create the target file   | No       | False           |

## License

GPL-3.0 License - see the [LICENSE](LICENSE) file for details

