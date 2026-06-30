cd /var/www/mm-jewellery
git pull
docker exec -i mm_db mysql -u root -proot_password << 'SQL'
CREATE USER IF NOT EXISTS 'mm_user'@'localhost' IDENTIFIED BY 'Root@123456';
CREATE USER IF NOT EXISTS 'mm_user'@'127.0.0.1' IDENTIFIED BY 'Root@123456';
CREATE USER IF NOT EXISTS 'mm_user'@'%' IDENTIFIED BY 'Root@123456';
GRANT ALL PRIVILEGES ON mm_jewellery_db.* TO 'mm_user'@'localhost';
GRANT ALL PRIVILEGES ON mm_jewellery_db.* TO 'mm_user'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mm_jewellery_db.* TO 'mm_user'@'%';
FLUSH PRIVILEGES;
SQL
cd Frontend
npm run build
systemctl reload nginx
docker-compose up -d
