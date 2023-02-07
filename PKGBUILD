
pkgname="esmanager"
pkgrel=1
pkgver="0.1"
pkgdesc="A Manager for the Engine Simulator by Ange Yaghi"
url="https://github.com/DDev247/engine-sim-manager"
arch=(x86_64)
license=('MIT')
depends=('nodejs>=16.19.0' 'npm>=8.19.2')
#source=("git.tar.gz::https://github.com/DDev247/engine-sim-manager/tarball/master")
makedepends=(git)

package() {
	git clone https://github.com/DDev247/engine-sim-manager.git ${srcdir}/gitsource
	echo "Clone done..."
	${srcdir}/gitsource/pack.sh
}

