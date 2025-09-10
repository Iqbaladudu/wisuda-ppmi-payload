#!/bin/bash

# Apache Benchmark script untuk testing endpoint pendaftaran wisudappmimesir.com
# Usage: ./benchmark-registration.sh [concurrent-users] [requests-per-user]

API_URL="https://wisudappmimesir.com/api/submit"
SAMPLE_FILE="test-data/registration-sample.json"
CONCURRENT=${1:-10}
REQUESTS=${2:-50}
TOTAL_REQUESTS=$((CONCURRENT * REQUESTS))

if [ ! -f "$SAMPLE_FILE" ]; then
    echo "Error: Sample file not found at $SAMPLE_FILE"
    exit 1
fi

# Check if names file exists, generate if not
NAMES_FILE="test-data/random-names.txt"
if [ ! -f "$NAMES_FILE" ]; then
    echo "Generating random names file..."
    ./generate-random-names.sh
fi

# Get random name and total names count
TOTAL_NAMES=$(wc -l < "$NAMES_FILE")
RANDOM_LINE=$((RANDOM % TOTAL_NAMES + 1))
RANDOM_NAME=$(sed -n "${RANDOM_LINE}p" "$NAMES_FILE")

# Extract and modify sample data with random name
SAMPLE_DATA=$(jq -r ".data" "$SAMPLE_FILE" | jq --arg name "$RANDOM_NAME" '.name = $name')

if [ "$SAMPLE_DATA" = "null" ]; then
    echo "Error: Could not extract sample data"
    exit 1
fi

# Create temporary file with JSON payload
TEMP_PAYLOAD=$(mktemp)
echo "$SAMPLE_DATA" > "$TEMP_PAYLOAD"

echo "=== Apache Benchmark Testing ==="
echo "URL: $API_URL"
echo "Concurrent users: $CONCURRENT"
echo "Requests per user: $REQUESTS"
echo "Total requests: $TOTAL_REQUESTS"
echo "Payload size: $(wc -c < "$TEMP_PAYLOAD") bytes"
echo ""

# Display sample payload
echo "Sample payload:"
cat "$TEMP_PAYLOAD" | jq . -C | head -20
echo ""

# Run Apache Benchmark
echo "Running benchmark..."
ab -n "$TOTAL_REQUESTS" \
   -c "$CONCURRENT" \
   -p "$TEMP_PAYLOAD" \
   -T "application/json" \
   -H "Content-Type: application/json" \
   -k \
   "$API_URL"

# Clean up
rm "$TEMP_PAYLOAD"

echo ""
echo "=== Benchmark completed ==="
echo "To test with different parameters:"
echo "  $ ./benchmark-registration.sh [concurrent] [requests]"
echo "Example: $ ./benchmark-registration.sh 20 100"