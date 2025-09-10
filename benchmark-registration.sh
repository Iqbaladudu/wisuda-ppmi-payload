#!/bin/bash

# Apache Benchmark script untuk testing endpoint pendaftaran wisudappmimesir.com
# Usage: ./benchmark-registration.sh [concurrent-users] [requests-per-user]

API_URL="https://wisuda-ppmi-payload.vercel.app/api/submit"
SAMPLE_FILE="test-data/registration-sample.json"
CONCURRENT=${1:-10}
REQUESTS=${2:-50}
TOTAL_REQUESTS=$((CONCURRENT * REQUESTS))

if [ ! -f "$SAMPLE_FILE" ]; then
    echo "Error: Sample file not found at $SAMPLE_FILE"
    exit 1
fi

# Extract the first sample data for benchmarking
SAMPLE_DATA=$(jq -r ".variations[0].data" "$SAMPLE_FILE")

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