#!/bin/bash

# Generate 1000 random Indonesian names for benchmarking
# This script creates a names file that will be used by benchmark-registration.sh

NAMES_FILE="test-data/random-names.txt"

# Create test-data directory if it doesn't exist
mkdir -p "test-data"

echo "Generating 1000 random Indonesian names..."

# Indonesian first names
FIRST_NAMES=(
    "Ahmad" "Muhammad" "Abdul" "Fatih" "Rizki" "Budi" "Agus" "Eko" "Hendra" "Faisal"
    "Andi" "Joko" "Slamet" "Sugeng" "Wahyu" "Yusuf" "Ibrahim" "Iskandar" "Khalid" "Lutfi"
    "Mahmud" "Nur" "Omar" "Qasim" "Rizal" "Saiful" "Taufik" "Umar" "Zain" "Fikri"
    "Hidayat" "Irfan" "Jamal" "Khamim" "Lukman" "Mustofa" "Nasir" "Panji" "Rahmat" "Syamsul"
    "Teguh" "Vino" "Wawan" "Yudi" "Zaki" "Amin" "Badru" "Chairul" "Dedi" "Edi"
    "Gilang" "Hadi" "Imam" "Jamil" "Kurniawan" "Laksamana" "Maman" "Najib" "Opik" "Prasetyo"
    "Qodir" "Rudi" "Samsul" "Topan" "Usman" "Viktor" "Wildan" "Xavier" "Yasin" "Zulkifli"
    "Adi" "Bagus" "Cahyo" "Dian" "Eka" "Fajar" "Galih" "Haris" "Iksan" "Jefri"
    "Koko" "Leo" "Mochamad" "Niko" "Oscar" "Putu" "Reza" "Sigit" "Tono" "Ucup"
    "Victor" "William" "Xena" "Yoga" "Zainal" "Arif" "Bima" "Catur" "Dimas" "Edo"
    "Ferry" "Guntur" "Heru" "Indra" "Jaka" "Krisna" "Lando" "Marsudi" "Nanda" "Okta"
    "Pandu" "Qori" "Rangga" "Setyo" "Taufan" "Ubaid" "Vian" "Wira" "Xavi" "Yusuf"
    "Zidan" "Aldi" "Bayu" "Candra" "Darma" "Erlangga" "Fahmi" "Ghani" "Hamzah" "Iqbal"
    "Joni" "Kiki" "Lutfi" "Maulana" "Nizar" "Olga" "Paijo" "Qays" "Rafli" "Sakti"
    "Tirta" "Umar" "Vino" "Wibowo" "Xanana" "Yance" "Zaki" "Azis" "Beni" "Coki"
    "Diki" "Emin" "Fathan" "Gama" "Husein" "Ivan" "Jundi" "Khalid" "Lagi" "Maman"
    "Najam" "Oman" "Pai" "Qasim" "Rizky" "Sulaiman" "Tomi" "Ujang" "Vino" "Wawan"
    "Yasin" "Zaini"
)

# Indonesian middle/last names
MIDDLE_NAMES=(
    "Abdullah" "Adi" "Cahya" "Darma" "Eka" "Fajar" "Gunawan" "Hidayat" "Irawan" "Jati"
    "Kusuma" "Lesmana" "Maulana" "Nugroho" "Pratama" "Qasim" "Rahman" "Santoso" "Tri" "Utomo"
    "Wijaya" "Xavier" "Yudhistira" "Zulkarnain" "Anwar" "Budiman" "Cahyono" "Darmawan" "Erlangga" "Fadillah"
    "Gunadi" "Hidayat" "Ismail" "Jauhari" "Kurniawan" "Laksono" "Mulyadi" "Natsir" "Prasetya" "Qodri"
    "Rachman" "Suryanto" "Taufik" "Utomo" "Viktor" "Wibisono" "Xanana" "Yusup" "Zainuddin" "Aziz"
    "Bachtiar" "Cahyadi" "Dwi" "Eko" "Fahmi" "Ghani" "Hendra" "Irwan" "Joko" "Krisna"
    "Laksana" "Mochtar" "Nur" "Omar" "Putra" "Rizal" "Sugianto" "Teguh" "Umar" "Victor"
    "Wahyudi" "Xaverius" "Yamin" "Zubair" "Amir" "Budi" "Cahyo" "Dian" "Eka" "Fajar"
    "Galih" "Haris" "Iksan" "Jefri" "Koko" "Leo" "Mochamad" "Niko" "Oscar" "Putu"
    "Reza" "Sigit" "Tono" "Ucup" "Victor" "William" "Xena" "Yoga" "Zainal" "Arif"
    "Bima" "Catur" "Dimas" "Edo" "Ferry" "Guntur" "Heru" "Indra" "Jaka" "Krisna"
    "Lando" "Marsudi" "Nanda" "Okta" "Pandu" "Qori" "Rangga" "Setyo" "Taufan" "Ubaid"
    "Vian" "Wira" "Xavi" "Yusuf" "Zidan" "Aldi" "Bayu" "Candra" "Darma" "Erlangga"
    "Fahmi" "Ghani" "Hamzah" "Iqbal" "Joni" "Kiki" "Lutfi" "Maulana" "Nizar" "Olga"
    "Paijo" "Qays" "Rafli" "Sakti" "Tirta" "Umar" "Vino" "Wibowo" "Xanana" "Yance"
    "Zaki" "Azis" "Beni" "Coki" "Diki" "Emin" "Fathan" "Gama" "Husein" "Ivan"
    "Jundi" "Khalid" "Lagi" "Maman" "Najam" "Oman" "Pai" "Qasim" "Rizky" "Sulaiman"
    "Tomi" "Ujang" "Vino" "Wawan" "Yasin" "Zaini"
)

# Indonesian last names
LAST_NAMES=(
    "Rahman" "Santoso" "Hidayat" "Pratama" "Wijaya" "Gunawan" "Surya" "Kurniawan" "Putra" "Nugroho"
    "Saputra" "Laksono" "Haryanto" "Setiawan" "Yudhistira" "Zulkarnain" "Firmansyah" "Kusuma" "Lesmana" "Maulana"
    "Abdullah" "Adi" "Cahya" "Darma" "Eka" "Fajar" "Gunawan" "Hidayat" "Irawan" "Jati"
    "Kusuma" "Lesmana" "Maulana" "Nugroho" "Pratama" "Qasim" "Rahman" "Santoso" "Tri" "Utomo"
    "Wijaya" "Xavier" "Yudhistira" "Zulkarnain" "Anwar" "Budiman" "Cahyono" "Darmawan" "Erlangga" "Fadillah"
    "Gunadi" "Hidayat" "Ismail" "Jauhari" "Kurniawan" "Laksono" "Mulyadi" "Natsir" "Prasetya" "Qodri"
    "Rachman" "Suryanto" "Taufik" "Utomo" "Viktor" "Wibisono" "Xanana" "Yusup" "Zainuddin" "Aziz"
    "Bachtiar" "Cahyadi" "Dwi" "Eko" "Fahmi" "Ghani" "Hendra" "Irwan" "Joko" "Krisna"
    "Laksana" "Mochtar" "Nur" "Omar" "Putra" "Rizal" "Sugianto" "Teguh" "Umar" "Victor"
    "Wahyudi" "Xaverius" "Yamin" "Zubair" "Amir" "Budi" "Cahyo" "Dian" "Eka" "Fajar"
    "Galih" "Haris" "Iksan" "Jefri" "Koko" "Leo" "Mochamad" "Niko" "Oscar" "Putu"
    "Reza" "Sigit" "Tono" "Ucup" "Victor" "William" "Xena" "Yoga" "Zainal" "Arif"
    "Bima" "Catur" "Dimas" "Edo" "Ferry" "Guntur" "Heru" "Indra" "Jaka" "Krisna"
    "Lando" "Marsudi" "Nanda" "Okta" "Pandu" "Qori" "Rangga" "Setyo" "Taufan" "Ubaid"
    "Vian" "Wira" "Xavi" "Yusuf" "Zidan" "Aldi" "Bayu" "Candra" "Darma" "Erlangga"
    "Fahmi" "Ghani" "Hamzah" "Iqbal" "Joni" "Kiki" "Lutfi" "Maulana" "Nizar" "Olga"
    "Paijo" "Qays" "Rafli" "Sakti" "Tirta" "Umar" "Vino" "Wibowo" "Xanana" "Yance"
    "Zaki" "Azis" "Beni" "Coki" "Diki" "Emin" "Fathan" "Gama" "Husein" "Ivan"
    "Jundi" "Khalid" "Lagi" "Maman" "Najam" "Oman" "Pai" "Qasim" "Rizky" "Sulaiman"
    "Tomi" "Ujang" "Vino" "Wawan" "Yasin" "Zaini"
)

# Generate 1000 random names
> "$NAMES_FILE"
for i in {1..1000}; do
    FIRST=${FIRST_NAMES[$RANDOM % ${#FIRST_NAMES[@]}]}
    MIDDLE=${MIDDLE_NAMES[$RANDOM % ${#MIDDLE_NAMES[@]}]}
    LAST=${LAST_NAMES[$RANDOM % ${#LAST_NAMES[@]}]}
    
    # Random combination of 2-3 names
    case $((RANDOM % 3)) in
        0) echo "$FIRST $LAST" >> "$NAMES_FILE" ;;
        1) echo "$FIRST $MIDDLE" >> "$NAMES_FILE" ;;
        2) echo "$FIRST $MIDDLE $LAST" >> "$NAMES_FILE" ;;
    esac
done

echo "Generated 1000 random names in $NAMES_FILE"
echo "Sample names:"
head -10 "$NAMES_FILE"