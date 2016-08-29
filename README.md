# Linux installation

### NodeJS and npm

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
 
Check if Node is correctly installed:
```bash
node -v  
npm -v
```

Update npm (v3.10+):
```bash
sudo npm install npm -g
```

### How to get Ruby (v2.0+), SASS & Compass ?
```bash
sudo apt-get install ruby-full
sudo gem install sass -v 3.4.9
sudo gem install compass
```

### Get php & Composer

* PHP  
```bash
sudo apt-get install apache2 php mysql-server libapache2-mod-php php-mysql
```

* Composer (run theses lines from anywhere)  
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === 'e115a8dc7871f15d853148a7fbac7da27d6c0030b848d9b3dc09e2a0388afed865e6a3d6b3c0fad45c48e2b5fc1196ae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Global installation
mv composer.phar /usr/local/bin/composer
```

# Grunt installation
```bash
sudo npm install grunt-cli -g
```

# In the project

### First run
```bash
# download node_modules folder
npm install
# get twig
composer install
```
### Dev
```bash
grunt serve
```