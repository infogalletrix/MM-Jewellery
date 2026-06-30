#!/bin/bash
# Restore script to import the SQL backup dump file back into MySQL database.

if [ ! -f db_backup.sql ]; then
  echo "Error: db_backup.sql file not found in the root directory!"
  exit 1
fi

echo "Restoring MySQL database from db_backup.sql..."
if mysql -h 127.0.0.1 -P 3307 -u root -proot_password mm_jewellery_db < db_backup.sql; then
  echo "Restore complete! Database successfully populated from db_backup.sql."
else
  echo "Error: Failed to restore the database. Please make sure the MySQL server is running on port 3307."
fi
