# Linux installation

### NodeJS and npm

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

# Check if Node and npm are correctly installed
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

# Check if they are correctly installed
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
curl -sS https://getcomposer.org/installer | php
# Global installation
sudo mv composer.phar /usr/local/bin/composer

# Check if Composer is correctly installed
composer --version
```

# Grunt installation
```bash
sudo npm install grunt-cli -g

# Check if grunt-cli is correctly installed
grunt --version
```

# Installing GraphicsMagick (for grunt-responsive-images task)

```bash
sudo add-apt-repository ppa:dhor/myway
sudo apt-get update
sudo apt-get install graphicsmagick
```

# In the project

*Once you have downloaded the sources from github, go to the root folder*

### First run
```bash
# Download node_modules folder
npm install

# Get twig
composer install

# Get Bower dependencies
bower install
```
