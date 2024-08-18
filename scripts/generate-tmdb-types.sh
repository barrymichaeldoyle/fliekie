#!/bin/bash

# Define the URL for the TMDB API OpenAPI specification
OPENAPI_SPEC_URL="https://developer.themoviedb.org/openapi/64542913e1f86100738e227f"

# Define the output file for the generated types
OUTPUT_FILE="./src/tmdb/types.ts"

# Download the OpenAPI specification
echo "Downloading TMDB API specification..."
curl -o tmdb-api-spec.json $OPENAPI_SPEC_URL

# Generate TypeScript types using openapi-typescript
echo "Generating TypeScript types..."
npx openapi-typescript tmdb-api-spec.json --output $OUTPUT_FILE

# Clean up the downloaded specification file
echo "Cleaning up..."
rm tmdb-api-spec.json

# Run Prettier on the generated TypeScript file
echo "Formatting the generated TypeScript file with Prettier..."
npx prettier --write $OUTPUT_FILE

echo "TypeScript types generated and formatted successfully in $OUTPUT_FILE"
