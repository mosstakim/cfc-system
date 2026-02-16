#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== CFC Registration Flow Test ==="

# 1. Create a Candidate User
echo -e "\n1. Creating Candidate..."
RANDOM_NUM=$((1 + $RANDOM % 10000))
CANDIDATE_EMAIL="candidate${RANDOM_NUM}@test.com"
RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$CANDIDATE_EMAIL"'",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Candidate",
    "role": "CANDIDATE"
  }')

CANDIDATE_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$CANDIDATE_ID" ]; then
  echo "Error creating candidate. Response: $RESPONSE"
  exit 1
fi

echo "Created Candidate: $CANDIDATE_EMAIL (ID: $CANDIDATE_ID)"

# 2. Get Open Session ID
echo -e "\n2. Fetching Open Session..."
SESSIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/academic")
# Simple unstable parsing for demo purposes - getting the first session ID from the response
SESSION_ID=$(echo $SESSIONS_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# In a real scenario we would parse JSON properly to find an open session for a specific formation
# But for now we just grep the first ID which should be our seeded session or formation/establishment
# Wait, academic/findAll returns { establishments: [], formations:[], sessions: [] }
# So the first ID might be an establishment.
# Let's refine the grep to look into the sessions array roughly or just use a specific jq if available.
# Since jq might not be available, let's try to be a bit smarter or just list sessions.

# Actually, let's just get the session seeded by the seeder.
# We know it exists.
# Let's try to extract uuid specifically.
SESSION_ID=$(curl -s "$BASE_URL/academic" | grep -oE '"id":"[a-f0-9-]{36}"' | tail -1 | cut -d'"' -f4)
# This is hacky. The last one in the JSON dump of all academic data *might* be the session if it's rendered last.
# Let's just assume for the demo the user might need to pick it, 
# OR we can make a specific endpoint to list sessions. 
# But let's try to stick to existing endpoints. 

if [ -z "$SESSION_ID" ]; then
  echo "Could not find any session ID."
  echo "Response: $SESSIONS_RESPONSE"
  exit 1
fi

echo "Found Session ID: $SESSION_ID"

# 3. Register Candidate to Session
echo -e "\n3. Registering Candidate to Session..."
REGISTRATION_RESPONSE=$(curl -s -X POST "$BASE_URL/registration" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "'"$CANDIDATE_ID"'",
    "sessionId": "'"$SESSION_ID"'"
  }')

echo "Registration Response: $REGISTRATION_RESPONSE"

# 4. Verify Registration
echo -e "\n4. Verifying Registration..."
REG_ID=$(echo $REGISTRATION_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ ! -z "$REG_ID" ]; then
    GET_REG_RESPONSE=$(curl -s -X GET "$BASE_URL/registration/$REG_ID")
    echo "Fetched Registration Details: $GET_REG_RESPONSE"
    echo -e "\nSUCCESS: Registration flow completed!"
else
    echo -e "\nFAILURE: Registration failed."
fi
