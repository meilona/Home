Meilona Eurica Karmelia - 00000026158
UAS - IF733 Cross - Platform Mobile Programming - CL

UAS INFO :
- link git repo : https://github.com/meilona/Home
- link hostingan : https://home-brown.vercel.app/login
- credential sample account (email // pass) : mei@gmail.com // 000000
- settingan firebase :
firebase: {
    apiKey: 'AIzaSyBJvuZu4W4yOMfj3qyQ1XTYyCTYm7_PgbY',
    authDomain: 'home-ea5b8.firebaseapp.com',
    projectId: 'home-ea5b8',
    storageBucket: 'home-ea5b8.appspot.com',
    messagingSenderId: '706728273302',
    appId: '1:706728273302:web:37a481e3f2c77df054a9b7',
    measurementId: 'G-C1VXSB150Z'
  }

ABOUT APP:
Aplikasi terdapat 3 tabs menu:
- Home : Menampilkan maps, beserta lokasi teman yang ada, bila pin lokasi teman ditekan, akan terlihat nama teman dan tempatnya. User dapat melakukan check in dengan pin lokasi saat ini dan memasukkan nama tempatnya untuk check in. Cara lain, user dapat pin lokasi manual pada maps lalu melakukan check in dengan memasukkan nama tempatnya. Sudah di set juga secara otomatis update lokasi terakhir user setiap 10 menit tapi ini nama tempatnya di set auto update karena geo coder google bayar kalo gasalah ko wkwk.
- Friend List : menampilkan nama teman, lalu bisa remove teman juga dengan slide ke kiri. Bisa search teman juga dengan ketik di searchboxnya. Lalu bisa add friend dengan tekan icon kanan atas buat mencari temannya. Halaman add friend emang kosong, tapi kalo masukin nama dia otomatis cari, konsepnya sama seperti di friend list cmn di hide pas awalnya.
- Profile : menampilkan foto dan data user. Bisa upload foto untuk ganti-ganti foto. Terdapat my feed juga yang isinya history check in user. Disini, calculate waktunya itu pake bantuan libs moment. Bisa delete feednya juga dengan press salah satu feed, ini pake libs hammer. Kalo mau log out ada iconnya di kanan atas.
Thanks.
