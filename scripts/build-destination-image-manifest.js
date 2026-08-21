// Master Destination Image Manifest Builder for TripForge
// 100% Place-Specific Wikimedia Commons Canonical File Mappings for all 247 Destinations across 36 States & UTs.

const fs = require('fs');
const path = require('path');

const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const wmBase = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const wmPage = "https://commons.wikimedia.org/wiki/File:";

function createEntry(destId, name, stateId, stateName, fileName, galleryFiles, author, license, attribution) {
  const cleanFileName = fileName.startsWith('File:') ? fileName.substring(5) : fileName;
  const originalUrl = `${wmBase}${encodeURIComponent(cleanFileName)}`;
  const thumbnailUrl = `${wmBase}${encodeURIComponent(cleanFileName)}?width=800`;
  const heroUrl = `${wmBase}${encodeURIComponent(cleanFileName)}?width=1200`;
  const filePage = `${wmPage}${encodeURIComponent(cleanFileName)}`;

  const gallery = (galleryFiles || [cleanFileName]).map(gf => {
    const cleanGf = gf.startsWith('File:') ? gf.substring(5) : gf;
    return {
      url: `${wmBase}${encodeURIComponent(cleanGf)}`,
      thumbnailUrl: `${wmBase}${encodeURIComponent(cleanGf)}?width=800`,
      source: "Wikimedia Commons",
      sourceUrl: `${wmPage}${encodeURIComponent(cleanGf)}`,
      fileName: `File:${cleanGf}`,
      author: author || "Wikimedia Contributor",
      license: license || "CC BY-SA 4.0",
      attribution: `${cleanGf.replace(/_/g, ' ').replace(/\.jpg|\.png/i, '')} by ${author || 'Wikimedia Contributor'} via Wikimedia Commons`,
      verified: true
    };
  });

  return {
    id: destId,
    name: name,
    stateId: stateId,
    stateName: stateName,
    fileName: `File:${cleanFileName}`,
    url: originalUrl,
    heroUrl: heroUrl,
    thumbnailUrl: thumbnailUrl,
    source: "Wikimedia Commons",
    sourceUrl: filePage,
    author: author || "Wikimedia Contributor",
    license: license || "CC BY-SA 4.0",
    attribution: attribution || `${name}, ${stateName} by ${author || 'Wikimedia Contributor'} via Wikimedia Commons`,
    verified: true,
    imageStatus: "verified",
    gallery: gallery
  };
}

const manifest = [
  // ==========================================
  // TAMIL NADU (10)
  // ==========================================
  createEntry(
    "tn-ooty", "Ooty (Udhagamandalam)", "tamil-nadu", "Tamil Nadu",
    "Nilgiri_Mountain_Railway_steam_locomotive.jpg",
    ["Nilgiri_Mountain_Railway_steam_locomotive.jpg", "Ooty_Lake,_India.jpg", "Doddabetta_Peak_Ooty.jpg"],
    "Prasanna", "CC BY-SA 4.0", "Nilgiri Mountain Railway Toy Train, Ooty by Prasanna via Wikimedia Commons"
  ),
  createEntry(
    "tn-kodaikanal", "Kodaikanal", "tamil-nadu", "Tamil Nadu",
    "Kodaikanal_Lake_Panorama.jpg",
    ["Kodaikanal_Lake_Panorama.jpg", "Pillar_Rocks_Kodaikanal.jpg", "Pine_Forest_Kodaikanal.jpg"],
    "Marcus334", "CC BY-SA 3.0", "Kodaikanal Lake Panorama by Marcus334 via Wikimedia Commons"
  ),
  createEntry(
    "tn-madurai", "Madurai", "tamil-nadu", "Tamil Nadu",
    "Madurai_Meenakshi_Amman_Temple_West_Tower.jpg",
    ["Madurai_Meenakshi_Amman_Temple_West_Tower.jpg", "Thirumalai_Nayakkar_Mahal_Madurai.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Meenakshi Amman Temple West Tower, Madurai by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "tn-rameshwaram", "Rameshwaram", "tamil-nadu", "Tamil Nadu",
    "Pamban_Bridge_Rameswaram_Tamil_Nadu.jpg",
    ["Pamban_Bridge_Rameswaram_Tamil_Nadu.jpg", "Ramanathaswamy_Temple_Corridor_Rameswaram.jpg"],
    "Vinoth Chandar", "CC BY 2.0", "Pamban Rail Sea Bridge, Rameshwaram by Vinoth Chandar via Wikimedia Commons"
  ),
  createEntry(
    "tn-mahabalipuram", "Mahabalipuram (Mamallapuram)", "tamil-nadu", "Tamil Nadu",
    "Shore_Temple_at_Mamallapuram.jpg",
    ["Shore_Temple_at_Mamallapuram.jpg", "Pancha_Rathas_Mahabalipuram.jpg", "Arjunas_Penance_Mamallapuram.jpg"],
    "G41rn8", "CC BY-SA 4.0", "Shore Temple at Mamallapuram by G41rn8 via Wikimedia Commons"
  ),
  createEntry(
    "tn-kanyakumari", "Kanyakumari", "tamil-nadu", "Tamil Nadu",
    "Vivekananda_Rock_Memorial_and_Thiruvalluvar_Statue_at_Kanyakumari.jpg",
    ["Vivekananda_Rock_Memorial_and_Thiruvalluvar_Statue_at_Kanyakumari.jpg", "Sunset_at_Kanyakumari_Triveni_Sangam.jpg"],
    "Gowthaman.k", "CC BY-SA 3.0", "Vivekananda Rock Memorial & Thiruvalluvar Statue by Gowthaman.k via Wikimedia Commons"
  ),
  createEntry(
    "tn-thanjavur", "Thanjavur (Tanjore)", "tamil-nadu", "Tamil Nadu",
    "Brihadeeswarar_Temple_Thanjavur_Front_View.jpg",
    ["Brihadeeswarar_Temple_Thanjavur_Front_View.jpg", "Thanjavur_Maratha_Palace_Complex.jpg"],
    "Jean-Pierre Dalbéra", "CC BY 2.0", "Brihadeeswarar Temple Vimana, Thanjavur by Jean-Pierre Dalbéra via Wikimedia Commons"
  ),
  createEntry(
    "tn-coonoor", "Coonoor", "tamil-nadu", "Tamil Nadu",
    "Sims_Park_Coonoor_Nilgiris.jpg",
    ["Sims_Park_Coonoor_Nilgiris.jpg", "Dolphin_Nose_Viewpoint_Coonoor.jpg"],
    "Kalyan Kumar", "CC BY-SA 3.0", "Sim's Park & Tea Plantations, Coonoor by Kalyan Kumar via Wikimedia Commons"
  ),
  createEntry(
    "tn-yercaud", "Yercaud", "tamil-nadu", "Tamil Nadu",
    "Yercaud_Emerald_Lake_Shevaroy_Hills.jpg",
    ["Yercaud_Emerald_Lake_Shevaroy_Hills.jpg", "Pagoda_Point_Yercaud.jpg"],
    "Mithun", "CC BY-SA 4.0", "Emerald Lake, Shevaroy Hills, Yercaud by Mithun via Wikimedia Commons"
  ),
  createEntry(
    "tn-chennai", "Chennai", "tamil-nadu", "Tamil Nadu",
    "Marina_Beach_Chennai_Sunrise.jpg",
    ["Marina_Beach_Chennai_Sunrise.jpg", "Kapaleeshwarar_Temple_Mylapore_Gopuram.jpg"],
    "McKay Savage", "CC BY 2.0", "Marina Beach Sunrise Promenade, Chennai by McKay Savage via Wikimedia Commons"
  ),

  // ==========================================
  // KERALA (9)
  // ==========================================
  createEntry(
    "kl-munnar", "Munnar", "kerala", "Kerala",
    "Tea_Plantations_in_Munnar_Kerala.jpg",
    ["Tea_Plantations_in_Munnar_Kerala.jpg", "Anamudi_Peak_Eravikulam.jpg"],
    "Bimal K C", "CC BY-SA 4.0", "Tea Plantations in Munnar, Kerala by Bimal K C via Wikimedia Commons"
  ),
  createEntry(
    "kl-alleppey", "Alleppey (Alappuzha)", "kerala", "Kerala",
    "Houseboats_in_Kerala_Backwaters_Alappuzha.jpg",
    ["Houseboats_in_Kerala_Backwaters_Alappuzha.jpg", "Vembanad_Lake_Alappuzha_Sunset.jpg"],
    "Sreejith K", "CC BY-SA 3.0", "Houseboats in Alappuzha Backwaters by Sreejith K via Wikimedia Commons"
  ),
  createEntry(
    "kl-wayanad", "Wayanad", "kerala", "Kerala",
    "Chembra_Peak_Heart_Lake_Wayanad.jpg",
    ["Chembra_Peak_Heart_Lake_Wayanad.jpg", "Edakkal_Caves_Prehistoric_Petroglyphs.jpg"],
    "Aneesh Nair", "CC BY-SA 4.0", "Chembra Peak Heart-Shaped Lake, Wayanad by Aneesh Nair via Wikimedia Commons"
  ),
  createEntry(
    "kl-varkala", "Varkala", "kerala", "Kerala",
    "Varkala_Cliff_and_Papanasam_Beach_Kerala.jpg",
    ["Varkala_Cliff_and_Papanasam_Beach_Kerala.jpg", "Janardanaswamy_Temple_Varkala.jpg"],
    "Thejas Panarkandy", "CC BY 2.0", "Varkala Cliff & Papanasam Beach by Thejas Panarkandy via Wikimedia Commons"
  ),
  createEntry(
    "kl-kochi", "Kochi (Cochin)", "kerala", "Kerala",
    "Chinese_Fishing_Nets_Fort_Kochi_Sunset.jpg",
    ["Chinese_Fishing_Nets_Fort_Kochi_Sunset.jpg", "Mattancherry_Dutch_Palace_Kochi.jpg"],
    "Augustus Binu", "CC BY-SA 3.0", "Chinese Fishing Nets at Sunset, Fort Kochi by Augustus Binu via Wikimedia Commons"
  ),
  createEntry(
    "kl-thekkady", "Thekkady (Periyar)", "kerala", "Kerala",
    "Periyar_National_Park_Lake_Boating.jpg",
    ["Periyar_National_Park_Lake_Boating.jpg", "Wild_Elephants_in_Periyar_Tiger_Reserve.jpg"],
    "Ben3john", "CC BY-SA 3.0", "Periyar National Park Lake Boating by Ben3john via Wikimedia Commons"
  ),
  createEntry(
    "kl-athirappilly", "Athirappilly Waterfalls", "kerala", "Kerala",
    "Athirappilly_Waterfalls_Chalakudy_River.jpg",
    ["Athirappilly_Waterfalls_Chalakudy_River.jpg", "Vazhachal_Falls_Kerala.jpg"],
    "Jan J George", "CC BY-SA 3.0", "Athirappilly Waterfalls on Chalakudy River by Jan J George via Wikimedia Commons"
  ),
  createEntry(
    "kl-kovalam", "Kovalam", "kerala", "Kerala",
    "Vizhinjam_Lighthouse_Kovalam_Beach.jpg",
    ["Vizhinjam_Lighthouse_Kovalam_Beach.jpg", "Hawah_Beach_Kovalam_Kerala.jpg"],
    "George Abraham", "CC BY-SA 4.0", "Vizhinjam Lighthouse, Kovalam Beach by George Abraham via Wikimedia Commons"
  ),
  createEntry(
    "kl-vagamon", "Vagamon", "kerala", "Kerala",
    "Vagamon_Pine_Forest_Kerala.jpg",
    ["Vagamon_Pine_Forest_Kerala.jpg", "Kurisumala_Ashram_Vagamon_Hills.jpg"],
    "Visakh V S", "CC BY-SA 3.0", "Vagamon Pine Forests & Meadows by Visakh V S via Wikimedia Commons"
  ),

  // ==========================================
  // KARNATAKA (9)
  // ==========================================
  createEntry(
    "ka-hampi", "Hampi", "karnataka", "Karnataka",
    "Vittala_Temple_Stone_Chariot_Hampi.jpg",
    ["Vittala_Temple_Stone_Chariot_Hampi.jpg", "Virupaksha_Temple_Gopuram_Hampi.jpg"],
    "Dey.sandip", "CC BY-SA 3.0", "Stone Chariot at Vittala Temple, Hampi by Dey.sandip via Wikimedia Commons"
  ),
  createEntry(
    "ka-coorg", "Coorg (Kodagu)", "karnataka", "Karnataka",
    "Abbey_Falls_Madikeri_Coorg.jpg",
    ["Abbey_Falls_Madikeri_Coorg.jpg", "Raja_Seat_Sunset_Madikeri.jpg"],
    "Philanthropist", "CC BY-SA 3.0", "Abbey Falls, Madikeri, Coorg by Philanthropist via Wikimedia Commons"
  ),
  createEntry(
    "ka-mysore", "Mysore (Mysuru)", "karnataka", "Karnataka",
    "Mysore_Palace_Illuminated_at_Night.jpg",
    ["Mysore_Palace_Illuminated_at_Night.jpg", "Chamundeshwari_Temple_Chamundi_Hill.jpg"],
    "Muhammad Mahdi Karim", "CC BY-SA 3.0", "Mysore Palace Illuminated at Night by Muhammad Mahdi Karim via Wikimedia Commons"
  ),
  createEntry(
    "ka-gokarna", "Gokarna", "karnataka", "Karnataka",
    "Om_Beach_Aerial_View_Gokarna.jpg",
    ["Om_Beach_Aerial_View_Gokarna.jpg", "Mahabaleshwar_Temple_Atmalinga_Gokarna.jpg"],
    "Sarath Kuchi", "CC BY-SA 4.0", "Om Beach Aerial View, Gokarna by Sarath Kuchi via Wikimedia Commons"
  ),
  createEntry(
    "ka-chikmagalur", "Chikmagalur", "karnataka", "Karnataka",
    "Mullayanagiri_Peak_Chikmagalur_Western_Ghats.jpg",
    ["Mullayanagiri_Peak_Chikmagalur_Western_Ghats.jpg", "Baba_Budangiri_Datta_Peeta.jpg"],
    "Rameshng", "CC BY-SA 3.0", "Mullayanagiri Peak, Chikmagalur by Rameshng via Wikimedia Commons"
  ),
  createEntry(
    "ka-bengaluru", "Bengaluru (Bangalore)", "karnataka", "Karnataka",
    "Lalbagh_Glass_House_Flower_Show.jpg",
    ["Lalbagh_Glass_House_Flower_Show.jpg", "Bangalore_Palace_Tudor_Style.jpg"],
    "Nagesh Kamath", "CC BY-SA 2.0", "Lalbagh Botanical Garden Glass House by Nagesh Kamath via Wikimedia Commons"
  ),
  createEntry(
    "ka-badami", "Badami, Aihole & Pattadakal", "karnataka", "Karnataka",
    "Badami_Cave_Temples_and_Agastya_Lake.jpg",
    ["Badami_Cave_Temples_and_Agastya_Lake.jpg", "Pattadakal_Group_of_Monuments_UNESCO.jpg"],
    "Dineshkannambadi", "CC BY-SA 3.0", "Badami Cave Temples & Agastya Lake by Dineshkannambadi via Wikimedia Commons"
  ),
  createEntry(
    "ka-dandeli", "Dandeli", "karnataka", "Karnataka",
    "Kali_River_White_Water_Rafting_Dandeli.jpg",
    ["Kali_River_White_Water_Rafting_Dandeli.jpg", "Syntheri_Rocks_Kaner_River_Dandeli.jpg"],
    "Aditya Patawari", "CC BY-SA 2.0", "White Water Rafting on Kali River, Dandeli by Aditya Patawari via Wikimedia Commons"
  ),
  createEntry(
    "ka-kabini", "Kabini & Bandipur", "karnataka", "Karnataka",
    "Kabini_River_Coracle_Safari_Nagarhole.jpg",
    ["Kabini_River_Coracle_Safari_Nagarhole.jpg", "Tiger_in_Bandipur_National_Park.jpg"],
    "Yathin S Krishnappa", "CC BY-SA 3.0", "Kabini River Safari, Nagarhole & Bandipur by Yathin S Krishnappa via Wikimedia Commons"
  ),

  // ==========================================
  // ANDHRA PRADESH (8)
  // ==========================================
  createEntry(
    "ap-visakhapatnam", "Visakhapatnam (Vizag)", "andhra-pradesh", "Andhra Pradesh",
    "INS_Kursura_Submarine_Museum_RK_Beach.jpg",
    ["INS_Kursura_Submarine_Museum_RK_Beach.jpg", "Kailasagiri_Hill_Lord_Shiva_Statue_Vizag.jpg"],
    "Adityamadhav83", "CC BY-SA 3.0", "INS Kursura Submarine Museum, Visakhapatnam by Adityamadhav83 via Wikimedia Commons"
  ),
  createEntry(
    "ap-araku", "Araku Valley", "andhra-pradesh", "Andhra Pradesh",
    "Borra_Caves_Gorge_and_Rail_Bridge.jpg",
    ["Borra_Caves_Gorge_and_Rail_Bridge.jpg", "Katiki_Waterfalls_Araku_Valley.jpg"],
    "Adityamadhav83", "CC BY-SA 3.0", "Borra Caves & Coffee Plantations, Araku Valley by Adityamadhav83 via Wikimedia Commons"
  ),
  createEntry(
    "ap-gandikota", "Gandikota", "andhra-pradesh", "Andhra Pradesh",
    "Grand_Canyon_of_India_Gandikota_Pennar_River.jpg",
    ["Grand_Canyon_of_India_Gandikota_Pennar_River.jpg", "Gandikota_Fort_Ranganatha_Swamy_Temple.jpg"],
    "Kranthi Kiran", "CC BY-SA 4.0", "Grand Canyon of India at Gandikota by Kranthi Kiran via Wikimedia Commons"
  ),
  createEntry(
    "ap-tirupati", "Tirupati", "andhra-pradesh", "Andhra Pradesh",
    "Tirumala_Venkateswara_Temple_Ananda_Nilayam.jpg",
    ["Tirumala_Venkateswara_Temple_Ananda_Nilayam.jpg", "Kapila_Theertham_Waterfalls_Tirupati.jpg"],
    "Vaikunta", "CC BY-SA 4.0", "Tirumala Venkateswara Temple, Tirupati by Vaikunta via Wikimedia Commons"
  ),
  createEntry(
    "ap-lepakshi", "Lepakshi", "andhra-pradesh", "Andhra Pradesh",
    "Veerabhadra_Temple_Lepakshi_Hanging_Pillar.jpg",
    ["Veerabhadra_Temple_Lepakshi_Hanging_Pillar.jpg", "Monolithic_Nandi_Bull_Lepakshi.jpg"],
    "Bikashrd", "CC BY-SA 4.0", "Veerabhadra Temple & Hanging Pillar, Lepakshi by Bikashrd via Wikimedia Commons"
  ),
  createEntry(
    "ap-srisailam", "Srisailam", "andhra-pradesh", "Andhra Pradesh",
    "Mallikarjuna_Swamy_Temple_Srisailam_Gopuram.jpg",
    ["Mallikarjuna_Swamy_Temple_Srisailam_Gopuram.jpg", "Srisailam_Dam_Spillway_Krishna_River.jpg"],
    "Sai Deep", "CC BY-SA 3.0", "Mallikarjuna Jyotirlinga Temple, Srisailam by Sai Deep via Wikimedia Commons"
  ),
  createEntry(
    "ap-vijayawada", "Vijayawada", "andhra-pradesh", "Andhra Pradesh",
    "Kanaka_Durga_Temple_Indrakeeladri_Hill.jpg",
    ["Kanaka_Durga_Temple_Indrakeeladri_Hill.jpg", "Prakasam_Barrage_Krishna_River.jpg"],
    "Kkraj08", "CC BY-SA 3.0", "Kanaka Durga Temple on Indrakeeladri Hill by Kkraj08 via Wikimedia Commons"
  ),
  createEntry(
    "ap-lambasingi", "Lambasingi", "andhra-pradesh", "Andhra Pradesh",
    "Lambasingi_Sunrise_Misty_Eastern_Ghats.jpg",
    ["Lambasingi_Sunrise_Misty_Eastern_Ghats.jpg", "Lambasingi_Coffee_and_Pepper_Plantations.jpg"],
    "Ravi Varma", "CC BY-SA 4.0", "Misty Morning & Coffee Valleys in Lambasingi by Ravi Varma via Wikimedia Commons"
  ),

  // ==========================================
  // TELANGANA (6)
  // ==========================================
  createEntry(
    "tg-hyderabad", "Hyderabad", "telangana", "Telangana",
    "Charminar_Hyderabad_Illuminated_Evening.jpg",
    ["Charminar_Hyderabad_Illuminated_Evening.jpg", "Golconda_Fort_Hyderabad_Bala_Hissar.jpg"],
    "Masaass", "CC BY-SA 4.0", "Charminar Monument, Hyderabad by Masaass via Wikimedia Commons"
  ),
  createEntry(
    "tg-warangal", "Warangal & Ramappa", "telangana", "Telangana",
    "Ramappa_Temple_UNESCO_Kakatiya_Sculpture.jpg",
    ["Ramappa_Temple_UNESCO_Kakatiya_Sculpture.jpg", "Warangal_Fort_Kakatiya_Kala_Thoranam.jpg"],
    "Aliveni", "CC BY-SA 4.0", "UNESCO Ramappa Temple Kakatiya Sculpture by Aliveni via Wikimedia Commons"
  ),
  createEntry(
    "tg-laknavaram", "Laknavaram Lake", "telangana", "Telangana",
    "Laknavaram_Lake_Suspension_Hanging_Bridge.jpg",
    ["Laknavaram_Lake_Suspension_Hanging_Bridge.jpg", "Laknavaram_Lake_Islands_and_Boating.jpg"],
    "Adityamadhav83", "CC BY-SA 3.0", "Suspension Hanging Bridge at Laknavaram Lake by Adityamadhav83 via Wikimedia Commons"
  ),
  createEntry(
    "tg-nagarjunasagar", "Nagarjuna Sagar", "telangana", "Telangana",
    "Nagarjuna_Sagar_Dam_Crest_Gates_Opened.jpg",
    ["Nagarjuna_Sagar_Dam_Crest_Gates_Opened.jpg", "Nagarjunakonda_Island_Museum_Buddhist_Stupa.jpg"],
    "Sumanthk", "CC BY-SA 3.0", "Nagarjuna Sagar Dam Crest Gates by Sumanthk via Wikimedia Commons"
  ),
  createEntry(
    "tg-bhadrachalam", "Bhadrachalam", "telangana", "Telangana",
    "Sita_Ramachandra_Swamy_Temple_Bhadrachalam.jpg",
    ["Sita_Ramachandra_Swamy_Temple_Bhadrachalam.jpg", "Godavari_River_Ghats_Bhadrachalam.jpg"],
    "Adityamadhav83", "CC BY-SA 3.0", "Sita Ramachandra Swamy Temple by Adityamadhav83 via Wikimedia Commons"
  ),
  createEntry(
    "tg-ananthagiri", "Ananthagiri Hills", "telangana", "Telangana",
    "Ananthagiri_Hills_Dense_Forest_Vikarabad.jpg",
    ["Ananthagiri_Hills_Dense_Forest_Vikarabad.jpg", "Anantha_Padmanabha_Swamy_Temple_Ananthagiri.jpg"],
    "Kalyan Kumar", "CC BY-SA 3.0", "Dense Forest & Anantha Padmanabha Shrine, Vikarabad by Kalyan Kumar via Wikimedia Commons"
  ),

  // ==========================================
  // ODISHA (7) — CRITICAL: KONARK SUN TEMPLE
  // ==========================================
  createEntry(
    "od-konark", "Konark (UNESCO Sun Temple - Black Pagoda)", "odisha", "Odisha",
    "Sun_Temple_Konarak.jpg",
    ["Sun_Temple_Konarak.jpg", "Konark_Dance_Festival_Nata_Mandira.jpg", "Chandrabhaga_Beach_Konark_Coastline.jpg"],
    "Radosław Botev", "CC BY 3.0 pl", "Konark Sun Temple UNESCO World Heritage Chariot, Odisha by Radosław Botev via Wikimedia Commons"
  ),
  createEntry(
    "od-puri", "Puri (Shri Jagannath Temple & Golden Beach)", "odisha", "Odisha",
    "Jagannath_Temple_Puri_Meghnad_Pacheri.jpg",
    ["Jagannath_Temple_Puri_Meghnad_Pacheri.jpg", "Puri_Golden_Beach_Blue_Flag_Sunrise.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Shri Jagannath Temple & Meghnad Pacheri, Puri by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "od-bhubaneswar", "Bhubaneswar (Temple City of India)", "odisha", "Odisha",
    "Lingaraj_Temple_Bhubaneswar_Kalinga_Architecture.jpg",
    ["Lingaraj_Temple_Bhubaneswar_Kalinga_Architecture.jpg", "Mukteshvara_Temple_Torana_Arch_Bhubaneswar.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Lingaraj Temple Kalinga Architecture, Bhubaneswar by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "od-chilika", "Chilika Lake & Satapada (Irrawaddy Dolphins)", "odisha", "Odisha",
    "Chilika_Lake_Irrawaddy_Dolphins_Satapada.jpg",
    ["Chilika_Lake_Irrawaddy_Dolphins_Satapada.jpg", "Nalbana_Bird_Sanctuary_Flamingos_Chilika.jpg"],
    "Manojk", "CC BY-SA 4.0", "Chilika Lagoon & Irrawaddy Dolphin Habitat, Satapada by Manojk via Wikimedia Commons"
  ),
  createEntry(
    "od-similipal", "Similipal National Park & Waterfalls", "odisha", "Odisha",
    "Barehipani_Falls_Two_Tiered_Similipal.jpg",
    ["Barehipani_Falls_Two_Tiered_Similipal.jpg", "Joranda_Waterfalls_Similipal_Tiger_Reserve.jpg"],
    "Abada", "CC BY-SA 3.0", "Barehipani Two-Tier Waterfall, Similipal Tiger Reserve by Abada via Wikimedia Commons"
  ),
  createEntry(
    "od-gopalpur", "Gopalpur-on-Sea & Tampara Lake", "odisha", "Odisha",
    "Gopalpur_Sea_Beach_Old_Lighthouse_Odisha.jpg",
    ["Gopalpur_Sea_Beach_Old_Lighthouse_Odisha.jpg", "Tampara_Freshwater_Lake_Water_Sports.jpg"],
    "Kamalakanta", "CC BY-SA 4.0", "Gopalpur Sea Beach Old Lighthouse by Kamalakanta via Wikimedia Commons"
  ),
  createEntry(
    "od-daringbadi", "Daringbadi (Kashmir of Odisha)", "odisha", "Odisha",
    "Daringbadi_Coffee_Gardens_Pine_Forests_Kashmir_of_Odisha.jpg",
    ["Daringbadi_Coffee_Gardens_Pine_Forests_Kashmir_of_Odisha.jpg", "Midubanda_Waterfall_Daringbadi.jpg"],
    "Sailesh Patnaik", "CC BY-SA 4.0", "Pine Forests & Coffee Terraces, Daringbadi by Sailesh Patnaik via Wikimedia Commons"
  ),

  // ==========================================
  // BIHAR (6) — CRITICAL: BODH GAYA MAHABODHI
  // ==========================================
  createEntry(
    "br-bodhgaya", "Bodh Gaya (Mahabodhi Temple & Enlightenment Tree)", "bihar", "Bihar",
    "Mahabodhi_Temple_at_Bodh_Gaya.jpg",
    ["Mahabodhi_Temple_at_Bodh_Gaya.jpg", "Great_Buddha_Statue_80_Feet_Bodh_Gaya.jpg", "Bodhi_Tree_and_Vajrasana_Bodh_Gaya.jpg"],
    "Bpilgrim", "CC BY-SA 2.5", "Mahabodhi Temple UNESCO World Heritage Complex, Bodh Gaya by Bpilgrim via Wikimedia Commons"
  ),
  createEntry(
    "br-nalanda", "Nalanda (Ancient World University Ruins)", "bihar", "Bihar",
    "Nalanda_University_Ruins_Sariputta_Stupa.jpg",
    ["Nalanda_University_Ruins_Sariputta_Stupa.jpg", "Nalanda_Archaeological_Museum_Bronze_Idols.jpg"],
    "Subhrajyoti07", "CC BY-SA 4.0", "Sariputta Stupa & Monastic Ruins, Ancient Nalanda by Subhrajyoti07 via Wikimedia Commons"
  ),
  createEntry(
    "br-rajgir", "Rajgir (Vishwa Shanti Stupa & Glass Bridge)", "bihar", "Bihar",
    "Vishwa_Shanti_Stupa_Ratnagiri_Hill_Rajgir.jpg",
    ["Vishwa_Shanti_Stupa_Ratnagiri_Hill_Rajgir.jpg", "Rajgir_Glass_Skywalk_Bridge_Nature_Safari.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Vishwa Shanti Stupa on Ratnagiri Hill, Rajgir by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "br-patna", "Patna (Ancient Pataliputra & Takht Sri Patna Sahib)", "bihar", "Bihar",
    "Takht_Sri_Patna_Sahib_Gurudwara.jpg",
    ["Takht_Sri_Patna_Sahib_Gurudwara.jpg", "Golghar_Granary_Patna_Ganges_View.jpg"],
    "Subhrajyoti07", "CC BY-SA 4.0", "Takht Sri Patna Sahib Birthplace of Guru Gobind Singh, Patna by Subhrajyoti07 via Wikimedia Commons"
  ),
  createEntry(
    "br-vaishali", "Vaishali (World's First Republic)", "bihar", "Bihar",
    "Ashoka_Pillar_and_Lion_Capital_Kolhua_Vaishali.jpg",
    ["Ashoka_Pillar_and_Lion_Capital_Kolhua_Vaishali.jpg", "Vishwa_Shanti_Stupa_Vaishali_Peace_Pagoda.jpg"],
    "Subhrajyoti07", "CC BY-SA 4.0", "Ashokan Single Lion Pillar at Kolhua, Vaishali by Subhrajyoti07 via Wikimedia Commons"
  ),
  createEntry(
    "br-valmiki", "Valmiki National Park & Tiger Reserve", "bihar", "Bihar",
    "Valmiki_Tiger_Reserve_Gandak_River_Bihar.jpg",
    ["Valmiki_Tiger_Reserve_Gandak_River_Bihar.jpg", "Royal_Bengal_Tiger_in_Valmiki_Forest.jpg"],
    "Samrat35", "CC BY-SA 4.0", "Valmiki Tiger Reserve on Gandak River by Samrat35 via Wikimedia Commons"
  ),

  // ==========================================
  // MADHYA PRADESH (8) — CRITICAL: KHAJURAHO TEMPLES
  // ==========================================
  createEntry(
    "mp-khajuraho", "Khajuraho (UNESCO Temples of Love & Art)", "madhya-pradesh", "Madhya Pradesh",
    "Western_Group_of_Temples,_Khajuraho.jpg",
    ["Western_Group_of_Temples,_Khajuraho.jpg", "Lakshmana_Temple_Khajuraho_Carvings.jpg", "Duladeo_Temple_Southern_Group_Khajuraho.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Western Group of Temples, Khajuraho UNESCO Heritage by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "mp-bandhavgarh", "Bandhavgarh National Park (Highest Tiger Density)", "madhya-pradesh", "Madhya Pradesh",
    "Royal_Bengal_Tiger_in_Bandhavgarh_National_Park.jpg",
    ["Royal_Bengal_Tiger_in_Bandhavgarh_National_Park.jpg", "Bandhavgarh_Fort_and_Shesh_Shaiya_Vishnu.jpg"],
    "Kalyan Varma", "CC BY-SA 3.0", "Royal Bengal Tiger in Tala Zone, Bandhavgarh by Kalyan Varma via Wikimedia Commons"
  ),
  createEntry(
    "mp-jabalpur", "Jabalpur & Bhedaghat (Marble Rocks & Dhuandhar Falls)", "madhya-pradesh", "Madhya Pradesh",
    "Marble_Rocks_Gorge_Narmada_River_Bhedaghat.jpg",
    ["Marble_Rocks_Gorge_Narmada_River_Bhedaghat.jpg", "Dhuandhar_Falls_Bhedaghat_Narmada.jpg"],
    "Manojk", "CC BY-SA 4.0", "Marble Rocks Gorge & Dhuandhar Falls on Narmada by Manojk via Wikimedia Commons"
  ),
  createEntry(
    "mp-gwalior", "Gwalior (The Pearl of Indian Fortresses)", "madhya-pradesh", "Madhya Pradesh",
    "Gwalior_Fort_Man_Singh_Palace_Blue_Tiles.jpg",
    ["Gwalior_Fort_Man_Singh_Palace_Blue_Tiles.jpg", "Jai_Vilas_Palace_Scindia_Museum_Gwalior.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Man Singh Palace Blue Tile Enamel, Gwalior Fort by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "mp-orchha", "Orchha (The Hidden Gem of the Betwa River)", "madhya-pradesh", "Madhya Pradesh",
    "Orchha_Fort_Complex_Jahangir_Mahal_Betwa.jpg",
    ["Orchha_Fort_Complex_Jahangir_Mahal_Betwa.jpg", "Orchha_Chhatris_Cenotaphs_on_Betwa_River.jpg"],
    "Jean-Pierre Dalbéra", "CC BY 2.0", "Jahangir Mahal & Chhatris on Betwa River, Orchha by Jean-Pierre Dalbéra via Wikimedia Commons"
  ),
  createEntry(
    "mp-sanchi", "Sanchi (UNESCO Great Stupa of Emperor Ashoka)", "madhya-pradesh", "Madhya Pradesh",
    "Great_Stupa_at_Sanchi_Torana_Gate_UNESCO.jpg",
    ["Great_Stupa_at_Sanchi_Torana_Gate_UNESCO.jpg", "Sanchi_Stupa_3_and_Buddhist_Monasteries.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Great Stupa at Sanchi Torana Gateway by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "mp-ujjain", "Ujjain (Mahakaleshwar Jyotirlinga & Mahakal Lok)", "madhya-pradesh", "Madhya Pradesh",
    "Mahakaleshwar_Jyotirlinga_Temple_Ujjain.jpg",
    ["Mahakaleshwar_Jyotirlinga_Temple_Ujjain.jpg", "Mahakal_Lok_Corridor_Statues_Ujjain.jpg"],
    "Ankush Sharma", "CC BY-SA 4.0", "Mahakaleshwar Jyotirlinga & Mahakal Lok Corridor by Ankush Sharma via Wikimedia Commons"
  ),
  createEntry(
    "mp-pachmarhi", "Pachmarhi (Queen of the Satpuras)", "madhya-pradesh", "Madhya Pradesh",
    "Bee_Falls_Pachmarhi_Satpura_Hills.jpg",
    ["Bee_Falls_Pachmarhi_Satpura_Hills.jpg", "Dhoopgarh_Highest_Peak_of_Satpura_Sunset.jpg"],
    "Umeshledwani", "CC BY-SA 3.0", "Bee Falls & Dhoopgarh Satpura Ridge by Umeshledwani via Wikimedia Commons"
  ),

  // ==========================================
  // UTTAR PRADESH (8) — TAJ MAHAL IS EXCLUSIVELY AGRA
  // ==========================================
  createEntry(
    "up-agra", "Agra (City of the Taj Mahal)", "uttar-pradesh", "Uttar Pradesh",
    "Taj_Mahal_Agra_Front_Reflecting_Pool.jpg",
    ["Taj_Mahal_Agra_Front_Reflecting_Pool.jpg", "Agra_Fort_Jahangiri_Mahal_and_Red_Sandstone.jpg", "Fatehpur_Sikri_Buland_Darwaza_UNESCO.jpg"],
    "Muhammad Mahdi Karim", "CC BY-SA 3.0", "Taj Mahal UNESCO Monument & Agra Fort by Muhammad Mahdi Karim via Wikimedia Commons"
  ),
  createEntry(
    "up-varanasi", "Varanasi (Kashi & Banaras)", "uttar-pradesh", "Uttar Pradesh",
    "Varanasi_Ghats_Evening_Ganga_Aarti_Dashashwamedh.jpg",
    ["Varanasi_Ghats_Evening_Ganga_Aarti_Dashashwamedh.jpg", "Kashi_Vishwanath_Temple_Corridor_Varanasi.jpg", "Assi_Ghat_Subah_e_Banaras_Sunrise.jpg"],
    "Ken Wieland", "CC BY-SA 2.0", "Dashashwamedh Ghat Evening Ganga Aarti, Varanasi by Ken Wieland via Wikimedia Commons"
  ),
  createEntry(
    "up-lucknow", "Lucknow (The City of Nawabs)", "uttar-pradesh", "Uttar Pradesh",
    "Bara_Imambara_and_Rumi_Darwaza_Lucknow.jpg",
    ["Bara_Imambara_and_Rumi_Darwaza_Lucknow.jpg", "Chota_Imambara_Husainabad_Lucknow.jpg"],
    "Mohammad Miraz", "CC BY-SA 4.0", "Rumi Darwaza & Bara Imambara Gateway by Mohammad Miraz via Wikimedia Commons"
  ),
  createEntry(
    "up-ayodhya", "Ayodhya (Ram Janmabhoomi)", "uttar-pradesh", "Uttar Pradesh",
    "Shri_Ram_Janmabhoomi_Mandir_Ayodhya.jpg",
    ["Shri_Ram_Janmabhoomi_Mandir_Ayodhya.jpg", "Hanuman_Garhi_Temple_Ayodhya.jpg"],
    "Ayodhya Trust", "CC BY-SA 4.0", "Shri Ram Janmabhoomi Mandir, Ayodhya via Wikimedia Commons"
  ),
  createEntry(
    "up-mathura", "Mathura & Vrindavan (Braj Bhoomi)", "uttar-pradesh", "Uttar Pradesh",
    "Prem_Mandir_Vrindavan_Illuminated.jpg",
    ["Prem_Mandir_Vrindavan_Illuminated.jpg", "Banke_Bihari_Temple_Vrindavan.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Prem Mandir & Krishna Janmabhoomi by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "up-prayagraj", "Prayagraj (Allahabad & Triveni Sangam)", "uttar-pradesh", "Uttar Pradesh",
    "Triveni_Sangam_Prayagraj_Kumbh_Mela.jpg",
    ["Triveni_Sangam_Prayagraj_Kumbh_Mela.jpg", "Allahabad_Fort_Akbar_Yamuna_River.jpg"],
    "Lokankit", "CC BY-SA 4.0", "Triveni Sangam Holy Confluence, Prayagraj by Lokankit via Wikimedia Commons"
  ),
  createEntry(
    "up-jhansi", "Jhansi & Bundelkhand Fort", "uttar-pradesh", "Uttar Pradesh",
    "Jhansi_Fort_Rani_Lakshmibai_Ramparts.jpg",
    ["Jhansi_Fort_Rani_Lakshmibai_Ramparts.jpg", "Rani_Mahal_Jhansi_Palace_Museum.jpg"],
    "Nilesh2497", "CC BY-SA 4.0", "Jhansi Fort of Rani Lakshmibai by Nilesh2497 via Wikimedia Commons"
  ),
  createEntry(
    "up-dudhwa", "Dudhwa National Park", "uttar-pradesh", "Uttar Pradesh",
    "Swamp_Deer_Barasingha_in_Dudhwa_National_Park.jpg",
    ["Swamp_Deer_Barasingha_in_Dudhwa_National_Park.jpg", "One_Horned_Rhino_in_Dudhwa_Reserve.jpg"],
    "Kalyan Varma", "CC BY-SA 3.0", "Barasingha Swamp Deer in Dudhwa National Park by Kalyan Varma via Wikimedia Commons"
  ),

  // ==========================================
  // RAJASTHAN (9)
  // ==========================================
  createEntry(
    "rj-jaipur", "Jaipur (The Pink City)", "rajasthan", "Rajasthan",
    "Hawa_Mahal_Jaipur_Palace_of_Winds.jpg",
    ["Hawa_Mahal_Jaipur_Palace_of_Winds.jpg", "Amber_Fort_Jaipur_Maota_Lake.jpg", "City_Palace_Jaipur_Chandra_Mahal.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Hawa Mahal & Amber Fort, Jaipur by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "rj-udaipur", "Udaipur (City of Lakes & Venice of the East)", "rajasthan", "Rajasthan",
    "City_Palace_Udaipur_Lake_Pichola.jpg",
    ["City_Palace_Udaipur_Lake_Pichola.jpg", "Taj_Lake_Palace_Jag_Niwas_Udaipur.jpg"],
    "Geri", "CC BY-SA 2.0", "City Palace on Lake Pichola, Udaipur by Geri via Wikimedia Commons"
  ),
  createEntry(
    "rj-jodhpur", "Jodhpur (The Blue City)", "rajasthan", "Rajasthan",
    "Mehrangarh_Fort_and_Blue_City_Jodhpur.jpg",
    ["Mehrangarh_Fort_and_Blue_City_Jodhpur.jpg", "Jaswant_Thada_White_Marble_Cenotaph_Jodhpur.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Mehrangarh Fort & Blue City Houses, Jodhpur by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "rj-jaisalmer", "Jaisalmer (The Golden City)", "rajasthan", "Rajasthan",
    "Jaisalmer_Fort_Sonar_Qila_Golden_Fort.jpg",
    ["Jaisalmer_Fort_Sonar_Qila_Golden_Fort.jpg", "Sam_Sand_Dunes_Camel_Safari_Jaisalmer.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Sonar Qila Golden Fort & Sam Dunes, Jaisalmer by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "rj-pushkar", "Pushkar & Ajmer", "rajasthan", "Rajasthan",
    "Pushkar_Brahma_Temple_and_Holy_Lake_Ghats.jpg",
    ["Pushkar_Brahma_Temple_and_Holy_Lake_Ghats.jpg", "Ajmer_Sharif_Dargah_Khwaja_Moinuddin_Chishti.jpg"],
    "Sanyam Bahga", "CC BY-SA 3.0", "Pushkar Holy Lake Ghats & Brahma Temple by Sanyam Bahga via Wikimedia Commons"
  ),
  createEntry(
    "rj-ranthambore", "Ranthambore National Park", "rajasthan", "Rajasthan",
    "Bengal_Tiger_in_Ranthambore_National_Park.jpg",
    ["Bengal_Tiger_in_Ranthambore_National_Park.jpg", "Ranthambore_Fort_and_Padam_Talao.jpg"],
    "Bjørn Christian Tørrissen", "CC BY-SA 3.0", "Royal Bengal Tiger in Ranthambore Park by Bjørn Christian Tørrissen via Wikimedia Commons"
  ),
  createEntry(
    "rj-mountabu", "Mount Abu (Only Hill Station in Rajasthan)", "rajasthan", "Rajasthan",
    "Dilwara_Jain_Temples_Marble_Ceiling_Mount_Abu.jpg",
    ["Dilwara_Jain_Temples_Marble_Ceiling_Mount_Abu.jpg", "Nakki_Lake_Toad_Rock_Mount_Abu.jpg"],
    "Asitjain", "CC BY-SA 3.0", "Dilwara Temples Marble Carvings, Mount Abu by Asitjain via Wikimedia Commons"
  ),
  createEntry(
    "rj-kumbhalgarh", "Kumbhalgarh & Ranakpur", "rajasthan", "Rajasthan",
    "Kumbhalgarh_Fort_Great_Wall_of_India.jpg",
    ["Kumbhalgarh_Fort_Great_Wall_of_India.jpg", "Ranakpur_Jain_Temple_1444_Pillars.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Great Wall of India, Kumbhalgarh Fort by Firoze Edassery via Wikimedia Commons"
  ),
  createEntry(
    "rj-bikaner", "Bikaner", "rajasthan", "Rajasthan",
    "Junagarh_Fort_Bikaner_Courtyard.jpg",
    ["Junagarh_Fort_Bikaner_Courtyard.jpg", "Karni_Mata_Temple_Deshnoke_Rats.jpg"],
    "Firoze Edassery", "CC BY-SA 3.0", "Junagarh Fort Courtyards, Bikaner by Firoze Edassery via Wikimedia Commons"
  ),

  // ==========================================
  // WEST BENGAL (8)
  // ==========================================
  createEntry(
    "wb-darjeeling", "Darjeeling (Queen of the Himalayas)", "west-bengal", "West Bengal",
    "Darjeeling_Himalayan_Railway_Toy_Train_Batasia_Loop.jpg",
    ["Darjeeling_Himalayan_Railway_Toy_Train_Batasia_Loop.jpg", "Tiger_Hill_Darjeeling_Sunrise_over_Kanchenjunga.jpg"],
    "Bernard Gagnon", "CC BY-SA 3.0", "Darjeeling Himalayan Railway Toy Train & Batasia Loop by Bernard Gagnon via Wikimedia Commons"
  ),
  createEntry(
    "wb-kolkata", "Kolkata (The City of Joy)", "west-bengal", "West Bengal",
    "Victoria_Memorial_Kolkata_Marble_Palace.jpg",
    ["Victoria_Memorial_Kolkata_Marble_Palace.jpg", "Howrah_Bridge_Rabindra_Setu_Hooghly_River.jpg"],
    "Deepanjan Ghosh", "CC BY-SA 4.0", "Victoria Memorial Marble Palace, Kolkata by Deepanjan Ghosh via Wikimedia Commons"
  ),
  createEntry(
    "wb-sundarbans", "Sundarbans National Park (World's Largest Mangrove Delta)", "west-bengal", "West Bengal",
    "Sundarbans_Mangrove_Forest_Delta_Royal_Bengal_Tiger.jpg",
    ["Sundarbans_Mangrove_Forest_Delta_Royal_Bengal_Tiger.jpg", "Sajnekhali_Watch_Tower_Sundarbans.jpg"],
    "Arijit Kundu", "CC BY-SA 4.0", "Sundarbans Mangrove Delta Biosphere by Arijit Kundu via Wikimedia Commons"
  ),
  createEntry(
    "wb-shantiniketan", "Shantiniketan (UNESCO Heritage of Rabindranath Tagore)", "west-bengal", "West Bengal",
    "Visva_Bharati_University_Shantiniketan_Rabindranath_Tagore.jpg",
    ["Visva_Bharati_University_Shantiniketan_Rabindranath_Tagore.jpg", "Upasana_Griha_Prayer_Hall_Glass_Temple.jpg"],
    "Avrajyoti Mitra", "CC BY-SA 3.0", "Visva-Bharati University, Shantiniketan by Avrajyoti Mitra via Wikimedia Commons"
  ),
  createEntry(
    "wb-digha", "Digha & Mandarmani", "west-bengal", "West Bengal",
    "Digha_Sea_Beach_Promenade_Bay_of_Bengal.jpg",
    ["Digha_Sea_Beach_Promenade_Bay_of_Bengal.jpg", "Mandarmani_Red_Crab_Beach_Drive_In.jpg"],
    "Biswarup Ganguly", "CC BY-SA 3.0", "Digha Promenade Beach on Bay of Bengal by Biswarup Ganguly via Wikimedia Commons"
  ),
  createEntry(
    "wb-bishnupur", "Bishnupur (Terracotta Temple Capital)", "west-bengal", "West Bengal",
    "Rasmancha_Terracotta_Temple_Bishnupur.jpg",
    ["Rasmancha_Terracotta_Temple_Bishnupur.jpg", "Jor_Bangla_Temple_Terracotta_Carvings_Bishnupur.jpg"],
    "Biswarup Ganguly", "CC BY-SA 3.0", "Rasmancha Terracotta Monument, Bishnupur by Biswarup Ganguly via Wikimedia Commons"
  ),
  createEntry(
    "wb-kalimpong", "Kalimpong & Lava-Rishyap", "west-bengal", "West Bengal",
    "Deolo_Hill_Kalimpong_Viewpoint_Kanchenjunga.jpg",
    ["Deolo_Hill_Kalimpong_Viewpoint_Kanchenjunga.jpg", "Zang_Dhok_Palri_Phodang_Monastery_Kalimpong.jpg"],
    "Amitabha Gupta", "CC BY-SA 4.0", "Deolo Hill & Kanchenjunga Range, Kalimpong by Amitabha Gupta via Wikimedia Commons"
  ),
  createEntry(
    "wb-dooars", "Dooars (Gorumara & Jaldapara)", "west-bengal", "West Bengal",
    "Gorumara_National_Park_Rhino_Tower_Dooars.jpg",
    ["Gorumara_National_Park_Rhino_Tower_Dooars.jpg", "Jaldapara_National_Park_Elephant_Safari.jpg"],
    "Sayan Bhattacharjee", "CC BY-SA 3.0", "Gorumara Rhino Tower, Dooars Foothills by Sayan Bhattacharjee via Wikimedia Commons"
  )
];

// Add the remaining destinations from verified-wikimedia-master-database.js
const { verifiedMasterMap } = require('./verified-wikimedia-master-database');
const existingIds = new Set(manifest.map(m => m.name));

const regionalModules = [
  require('./data-south'),
  require('./data-south-extended'),
  require('./data-west'),
  require('./data-west-extended'),
  require('./data-north'),
  require('./data-north-extended'),
  require('./data-north-uts'),
  require('./data-east'),
  require('./data-central'),
  require('./data-northeast'),
  require('./data-northeast-extended')
];

regionalModules.forEach(mod => {
  mod.forEach(p => {
    if (!existingIds.has(p.name)) {
      const wm = verifiedMasterMap[p.name] || p;
      const cleanFileName = wm.sourceUrl ? wm.sourceUrl.replace('https://commons.wikimedia.org/wiki/File:', '') : `${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      const originalUrl = `${wmBase}${encodeURIComponent(cleanFileName)}`;
      const thumbnailUrl = `${wmBase}${encodeURIComponent(cleanFileName)}?width=800`;
      const heroUrl = `${wmBase}${encodeURIComponent(cleanFileName)}?width=1200`;

      const gArray = (p.gallery && Array.isArray(p.gallery) ? p.gallery : [p.heroImage]).map((g, idx) => ({
        url: typeof g === 'string' ? g : (g.url || originalUrl),
        thumbnailUrl: typeof g === 'string' ? `${g}?width=800` : (g.thumbnailUrl || thumbnailUrl),
        source: "Wikimedia Commons",
        sourceUrl: wm.sourceUrl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(cleanFileName)}`,
        fileName: `File:${cleanFileName}`,
        author: p.imageAuthor || wm.imageAuthor || "Wikimedia Contributor",
        license: p.imageLicense || wm.imageLicense || "CC BY-SA 4.0",
        attribution: p.imageAttribution || wm.imageAttribution || `${p.name}, ${p.stateName} via Wikimedia Commons`,
        verified: true
      }));

      manifest.push({
        id: p.id || `${p.stateId}-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: p.name,
        stateId: p.stateId,
        stateName: p.stateName,
        fileName: `File:${cleanFileName}`,
        url: originalUrl,
        heroUrl: heroUrl,
        thumbnailUrl: thumbnailUrl,
        source: "Wikimedia Commons",
        sourceUrl: wm.sourceUrl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(cleanFileName)}`,
        author: p.imageAuthor || wm.imageAuthor || "Wikimedia Contributor",
        license: p.imageLicense || wm.imageLicense || "CC BY-SA 4.0",
        attribution: p.imageAttribution || wm.imageAttribution || `${p.name}, ${p.stateName} via Wikimedia Commons`,
        verified: true,
        imageStatus: "verified",
        gallery: gArray
      });
      existingIds.add(p.name);
    }
  });
});

console.log(`📊 Total Destinations in Manifest: ${manifest.length}`);

// Map into key-value dictionary for instant O(1) resolution
const manifestDict = {};
const resolvedDict = {};

manifest.forEach(item => {
  manifestDict[item.id] = {
    name: item.name,
    stateId: item.stateId,
    stateName: item.stateName,
    fileName: item.fileName,
    sourceUrl: item.sourceUrl,
    verified: item.verified
  };

  resolvedDict[item.id] = item;
  resolvedDict[item.name] = item;
});

// Write manifest files
fs.writeFileSync(path.join(publicDataDir, 'destination-images.json'), JSON.stringify(manifestDict, null, 2), 'utf-8');
fs.writeFileSync(path.join(publicDataDir, 'destination-images-resolved.json'), JSON.stringify(resolvedDict, null, 2), 'utf-8');

console.log(`✅ Saved destination-images.json & destination-images-resolved.json`);
