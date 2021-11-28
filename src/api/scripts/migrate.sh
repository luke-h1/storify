#!/bin/bash

echo "what name should the migration be?"
read -r RESP
npx typeorm migration:generate -n $RESP
