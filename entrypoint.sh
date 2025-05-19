#!/bin/bash

# Start PostgreSQL
service postgresql start

# Start MongoDB
mongod --fork --logpath /var/log/mongod.log

# Wait for databases to be ready
sleep 5

# Create MongoDB database if not exists
mongosh --eval "db.getSiblingDB('TrackerDB')"

# Run your application
dotnet Core.dll
