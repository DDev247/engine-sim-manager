# Maintainer: DDev247 <ddev247.work@gmail.com>
pkgname="esmanager"
pkgrel=4
pkgver="0.1"
pkgdesc="A Manager for the Engine Simulator by Ange Yaghi"
url="https://github.com/DDev247/engine-sim-manager"
arch=(x86_64)
license=('MIT')
depends=('nodejs>=16.19.0' 'npm>=8.19.2')
#source=("git.tar.gz::https://github.com/DDev247/engine-sim-manager/tarball/master")
makedepends=(git)

package() {
	echo "====> Cloning the repo (this can take a while)..."

	# clone the repo
	rm -rf ${srcdir}/gitsource
	git clone https://github.com/DDev247/engine-sim-manager.git ${srcdir}/gitsource
	
	echo "====> Clone done..."
	echo "====> Installing NPM packages (this takes a while)..."

	# install npm packages
	npm install --prefix ${srcdir}/gitsource

	echo "====> NPM install done..."
	echo "====> Packing (this can take a while)..."
	
	# run react build
	npm run build --prefix ${srcdir}/gitsource

	# remove previous build just in case
	rm -rf ${srcdir}/gitsource/bin/*
	mkdir -p ${srcdir}/gitsource/bin

	# pack electron
	command="cd ${srcdir}/gitsource && npx electron-packager . esmanager --ignore=\"/src|/public|README|Procfile|.gitignore|pack.sh|/es\" --arch=\"x64\" --platform=\"linux\" --out=\"bin\" && exit 0"
	echo $command | sh
	
	echo "====> Packing done..."
	echo "====> Copying files..."
	cp -r ${srcdir}/gitsource/src/themes ${srcdir}/gitsource/bin/*/
	cp -r ${srcdir}/gitsource/build/static/media ${srcdir}/gitsource/bin/esmanager-linux-x64/resources/app/build/static

	echo "====> Symlink binary..."
	mkdir -p ${pkgdir}/usr/bin
	
	# Symlink the bin folder to /usr/bin/esmanager
	# (bypass for weird behaviour where folder gets linked :shrug:)
	ln -s ${srcdir}/gitsource/bin/esmanager-linux-x64/esmanager ${pkgdir}/usr/bin/esmanager

	echo "====> Done!"
}

