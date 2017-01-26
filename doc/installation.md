# Linux installation

### NodeJS and npm

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
 
Check if Node and npm are correctly installed:
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

Check if they are correctly installed:
```bash
ruby -v
sass -v
compass version
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

Check if Composer is correctly installed:
```bash
composer --version
```

# Grunt installation
```bash
sudo npm install grunt-cli -g

# Check if grunt-cli is correctly installed
grunt --version
```

# In the project

*Once you have downloaded the sources from github, go to the root folder*

### First run
```bash
# Download node_modules folder
npm install
# Get twig
composer install
```
