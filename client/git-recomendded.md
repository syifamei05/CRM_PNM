💡 Alur Kerja Normal Dengan Branch

buat branch baru

git checkout -b fitur-penting


kerja, edit file, commit di branch itu

git add .
git commit -m "tambah fitur penting"


kembali ke main

git checkout main


gabungkan branch ke main (merge)

git merge fitur-penting
