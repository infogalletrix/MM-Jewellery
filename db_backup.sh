#!/bin/bash
# Backup script to dump mm_jewellery_db to a SQL file so it can be committed to GitHub.

echo "Backing up MySQL database..."
if mysqldump -h 127.0.0.1 -P 3307 -u root -proot_password mm_jewellery_db > db_backup.sql; then
  echo "Backup complete! Database dumped successfully to db_backup.sql"
  echo "You can now commit and push db_backup.sql to GitHub using:"
  echo "  git add db_backup.sql"
  echo "  git commit -m 'Update database backup'"
  echo "  git push"
else
  echo "Error: Failed to back up the database. Please make sure the MySQL server is running on port 3307."
fi
