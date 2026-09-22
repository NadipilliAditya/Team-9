require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Student = require('./src/models/Student');

function getBatch(roll) {
  const yr = roll ? roll.substring(0,2) : '23';
  const map = { '23': '2027', '24': '2028', '25': '2029', '22': '2026', '26': '2030' };
  return map[yr] || '2027';
}

const branchToDept = {
  AID: 'Artificial Intelligence & Data Science',
  CSD: 'Computer Science & Design',
  CAI: 'Computer Science & AI',
  CSM: 'Computer Science & Mathematics',
  CSC: 'Computer Science & Cybersecurity',
  CSE: 'Computer Science'
};

const studentData = [
  { name: 'Bhavani sankar', roll: '23B21A4268', college: 'KIET', branch: 'CSM', email: 'bhavanisanakrdavuluri1094@gmail.com' },
  { name: 'KOLAMURI BHAVYA SRI', roll: '23JN1A4596', college: 'KIEW', branch: 'AID', email: 'bhavyasrikolamuri@gmail.com' },
  { name: 'MAMIDALA GOVIND', roll: '23B21A4541', college: 'KIET', branch: 'AID', email: 'mamidalagovind5599@gmail.com' },
  { name: 'BOLISETTI JYOTHI SWARUPA', roll: '23B21A4516', college: 'KIET', branch: 'AID', email: 'swaroopa880621@gmail.com' },
  { name: 'PANASA RAJINI', roll: '23JN1A4331', college: 'KIEW', branch: 'CAI', email: 'rajini1788@gmail.com' },
  { name: 'DASARI NAVEEN KUMAR', roll: '24B21A4419', college: 'KIET', branch: 'CSD', email: 'dasarinaveenkumar277@gmail.com' },
  { name: 'MALLIPUDI SATYA KRUPA', roll: '24B21A4213', college: 'KIET', branch: 'CSM', email: 'satyakrupamallipudi@gmail.com' },
  { name: 'S Siri Bhuvaneswari', roll: '24JN1A4513', college: 'KIEW', branch: 'AID', email: 'somarouthusiri26@gmail.com' },
  { name: 'SABBISETTY ANJANA LAKSHMI ASRITHA', roll: '24JN1A4591', college: 'KIEW', branch: 'AID', email: 'asrithasabbisetty07@gmail.com' },
  { name: 'Ashwini', roll: '23JN1A4534', college: 'KIEW', branch: 'AID', email: 'bashwinidurga@gmail.com' },
  { name: 'DEVAGUPTAPU VENKATA SURYA SHANMUKHA', roll: '23JN1A4215', college: 'KIEW', branch: 'AID', email: 'shanmukha2775@gmail.com' },
  { name: 'GIRIDHAR SHYAM SAMSANI', roll: '23B21A4269', college: 'KIET', branch: 'CSM', email: 'giridharsyamsamsani@gmail.com' },
  { name: 'Peddapalli Satya venkata Siva Durga Prasad', roll: '23B21A4591', college: 'KIET', branch: 'AID', email: 'psivadurgaprasad88@gmail.com' },
  { name: 'GANDHAM SRI LAKSHMI', roll: '23JN1A4533', college: 'KIEW', branch: 'AID', email: 'gandhamsrilakshmi9999@gmail.com' },
  { name: 'BALUKULA SAMPATH', roll: '24B21A4345', college: 'KIET', branch: 'CAI', email: 'sampaths3877@gmail.com' },
  { name: 'YUVARAJU BONDADA', roll: '246Q1A4307', college: 'KIET', branch: 'CAI', email: 'yuvarajubondada111@gmail.com' },
  { name: 'MONIKA KONA', roll: '24JN1A4306', college: 'KIEW', branch: 'CAI', email: 'k.monikaa10@gmail.com' },
  { name: 'CHINTADA RAMYA SRI', roll: '24JN1A4502', college: 'KIEW', branch: 'AID', email: 'ramyasri15007@gmail.com' },
  { name: 'Karthik', roll: '23B21A4661', college: 'KIET', branch: 'CSC', email: 'karthik939075@gmail.com' },
  { name: 'Nithin Kumar Mancheela', roll: '23B21A4225', college: 'KIET', branch: 'CSM', email: 'nithinmancheela@gmail.com' },
  { name: 'LAXMI VISALYA SABBISETTI', roll: '23JN1A4543', college: 'KIEW', branch: 'AID', email: 'lakshmivisalyasabbisetti@gmail.com' },
  { name: 'MASAA KEERTHI', roll: '23JN1A45A1', college: 'KIEW', branch: 'AID', email: 'keerthimasaa@gmail.com' },
  { name: 'PECHETTI SRI RAMA CHANDRA MURTHI', roll: '23B21A4538', college: 'KIET', branch: 'AID', email: 'srirampechetti251@gmail.com' },
  { name: 'K HEMA SUPRIYA', roll: '24JN1A4316', college: 'KIEW', branch: 'CAI', email: 'hemasupriyakarri@gmail.com' },
  { name: 'ACHANTA SIVA RAMA KRISHNA', roll: '24B21A4576', college: 'KIET', branch: 'AID', email: 'asivaramakrishna018@gmail.com' },
  { name: 'BEELA VIVEK', roll: '24B21A43A1', college: 'KIET', branch: 'CAI', email: 'beelavivek730@gmail.com' },
  { name: 'BEVARA ANJILI RANI', roll: '24B21A4209', college: 'KIET', branch: 'CSM', email: 'anjiliranibevara@gmail.com' },
  { name: 'Akhil', roll: '23B21A45B4', college: 'KIET', branch: 'AID', email: 'akhilvanama19@gmail.com' },
  { name: 'R BALA NIKHITHA', roll: '23JN1A4581', college: 'KIEW', branch: 'AID', email: 'nikhithan172@gmail.com' },
  { name: 'PAIDIKONDALA DEVI', roll: '23B21A4506', college: 'KIET', branch: 'AID', email: 'devipaidikondala3@gmail.com' },
  { name: 'LITHIKASRAYA C', roll: '23B21A4618', college: 'KIET', branch: 'CSC', email: 'lithikasrayac@gmail.com' },
  { name: 'SAI TEJA REVURI', roll: '24B25A4305', college: 'KIET', branch: 'CAI', email: 'steja9759@gmail.com' },
  { name: 'ARIGELA DURGA SAI MANIKANTA', roll: '25B25A4516', college: 'KIET', branch: 'AID', email: 'arigelamanikanta2005@gmail.com' },
  { name: 'GOLUGURI KEERTHI SRI JYOTHI', roll: '24JN1A4269', college: 'KIEW', branch: 'CSM', email: 'ksri01437@gmail.com' },
  { name: 'NEELAM MOUNIKA', roll: '24JN1A4526', college: 'KIEW', branch: 'AID', email: 'mounika.neelam03@gmail.com' },
  { name: 'MARNI HARISH JAYARAM', roll: '24B21A4281', college: 'KIET', branch: 'CSM', email: 'mharishjayram77@gmail.com' },
  { name: 'Meena', roll: '23JN1A45C0', college: 'KIEW', branch: 'AID', email: 'meenachittuluri@gmail.com' },
  { name: 'MANDADI NAGARATNAKAR', roll: '23B21A45A6', college: 'KIET', branch: 'AID', email: 'nagaratnakarmandadi@gmail.com' },
  { name: 'CHELLUMAHANTHI KARTHIK', roll: '23B21A4532', college: 'KIET', branch: 'AID', email: 'karthikch834@gmail.com' },
  { name: 'KOLA SRI RAMARAJU', roll: '23B21A4262', college: 'KIET', branch: 'CSM', email: 'sriramkola153@gmail.com' },
  { name: 'BINDUSRI TALAKONDA', roll: '23JN1A4565', college: 'KIEW', branch: 'AID', email: 'bindusri2294@gmail.com' },
  { name: 'GUNTAMUKKALA BHARATHI', roll: '25JN5A4204', college: 'KIEW', branch: 'CSM', email: 'bharathiguntamukkala123@gmail.com' },
  { name: 'SIRIPURAPU DEEKSHITHA', roll: '24B21A4410', college: 'KIET', branch: 'CSD', email: 'sdeekshitha73@gmail.com' },
  { name: 'TADIKALA YASWANTH KUMAR', roll: '24B21A4567', college: 'KIET', branch: 'AID', email: 'tadikalayaswanthkumar@gmail.com' },
  { name: 'MOTURI TEJA GANESH', roll: '24B21A45C4', college: 'KIET', branch: 'AID', email: 'moturitejaganesh@gmail.com' },
  { name: 'Rahul', roll: '23B21A4546', college: 'KIET', branch: 'AID', email: 'rahuldravidpalani2005@gmail.com' },
  { name: 'Rayudu Veera Venkata Swamy', roll: '23B21A4595', college: 'KIET', branch: 'AID', email: 'swamyrayudu7288@gmail.com' },
  { name: 'CHINTHALAPUDI VENKATA SATYA SAI ABHISHEK', roll: '23B21A4565', college: 'KIET', branch: 'AID', email: 'abhi31mahi@gmail.com' },
  { name: 'PALIVELA LAKSHMI TARUN', roll: '23B21A4558', college: 'KIET', branch: 'AID', email: 'lakshmitaruntarun@gmail.com' },
  { name: 'Gattem Aruna', roll: '23JN1A4314', college: 'KIEW', branch: 'CAI', email: 'gattemaruna68@gmail.com' },
  { name: 'MALLA HARSHA VARDHAN', roll: '24B21A4260', college: 'KIET', branch: 'CSM', email: 'mallaharshavardhannaidu@gmail.com' },
  { name: 'CHENNAMALLI SURENDRA', roll: '24B21A43A5', college: 'KIET', branch: 'CAI', email: 'surendrachennamalli177@gmail.com' },
  { name: 'ROOPA SRI YENUGU', roll: '24B21A4310', college: 'KIET', branch: 'CAI', email: 'yroopasri6@gmail.com' },
  { name: 'Tharun Bole', roll: '25B25A4420', college: 'KIET', branch: 'CSD', email: 'gowdatharun692@gmail.com' },
  { name: 'Charan', roll: '23B21A4311', college: 'KIET', branch: 'CAI', email: 'charannaidukumpatla104@gmail.com' },
  { name: 'Thumpala Haribabu', roll: '23B21A4265', college: 'KIET', branch: 'CSM', email: 'mvmanikanta98851@gmail.com' },
  { name: 'TAMMANA SRI LAKSHMI VASANTHI', roll: '23B21A4202', college: 'KIET', branch: 'CSM', email: 'vasanthitammana56@gmail.com' },
  { name: 'GOPISETTI HEMA SAI DEEPTHI', roll: '23JN1A4550', college: 'KIEW', branch: 'AID', email: 'gopisettideepu@gmail.com' },
  { name: 'MOKA DIVYA', roll: '23B21A4301', college: 'KIET', branch: 'CAI', email: 'divyamoka7511@gmail.com' },
  { name: 'BEPALA PURNIMA', roll: '24JN1A4506', college: 'KIEW', branch: 'AID', email: 'purnimareddy0026@gmail.com' },
  { name: 'Veeramsetti Y N D Sanjay Bhargav', roll: '24B21A4577', college: 'KIET', branch: 'AID', email: 'sanjayrishipranav11@gmail.com' },
  { name: 'MOTURI LALITHA SOWJANYA', roll: '25B25A4205', college: 'KIET', branch: 'CSM', email: 'moturilalithasowjanya@gmail.com' },
  { name: 'KADIYALA MANI NAGA VENKATESH', roll: '24B21A4494', college: 'KIET', branch: 'CSD', email: 'kadiyalamani5678@gmail.com' },
  { name: 'Sanjeetha', roll: '23B21A4304', college: 'KIET', branch: 'CAI', email: 'sanjusanjeetha18@gmail.com' },
  { name: 'KATTEBOINA RAVI TEJA', roll: '23B21A4348', college: 'KIET', branch: 'CAI', email: 'katteboinaraviteja21@gmail.com' },
  { name: 'ACHANTA VEERA KUMARI', roll: '23JN1A4510', college: 'KIEW', branch: 'AID', email: 'vkachanta9346@gmail.com' },
  { name: 'NARUKULA DEVI', roll: '23JN1A45E0', college: 'KIEW', branch: 'AID', email: 'devivarshininarukula2005@gmail.com' },
  { name: 'YANDAPALLI SAI VARSHITHA', roll: '23B21A4205', college: 'KIET', branch: 'CSM', email: 'saivarshithayandapalli@gmail.com' },
  { name: 'AKSHAYA JOGA', roll: '24JN1A4505', college: 'KIEW', branch: 'AID', email: 'akshayajoga28@gmail.com' },
  { name: 'D GANGA BHAVANI', roll: '25JN5A4202', college: 'KIEW', branch: 'CSM', email: 'dasamgangabhavani81@gmail.com' },
  { name: 'HARSHA VARDHAN ARIPAKA', roll: '24B21A4256', college: 'KIET', branch: 'CSM', email: 'aripakaharshavardhan09@gmail.com' },
  { name: 'RAPARTHI DURGA VENKATA MANIKANTA', roll: '25B25A4238', college: 'KIET', branch: 'CSM', email: 'manikantaraparthi71@gmail.com' },
  { name: 'Aditya', roll: '23B21A4368', college: 'KIET', branch: 'CAI', email: 'nadipilliaditya7@gmail.com' },
  { name: 'YELLAPU JAYASREE', roll: '23JN1A4211', college: 'KIEW', branch: 'CSM', email: 'jayasreeyellapu6475@gmail.com' },
  { name: 'Velaga Sai Chandu', roll: '23B21A4297', college: 'KIET', branch: 'CSM', email: 'srinagadurgakotikalapudi@gmail.com' },
  { name: 'Alapati Avinash', roll: '23B21A4378', college: 'KIET', branch: 'CAI', email: 'avinashalapati11@gmail.com' },
  { name: 'Puligedda Naga Sri Verra Varun', roll: '23B21A4323', college: 'KIET', branch: 'CAI', email: 'harirammohanraju@gmail.com' },
  { name: 'ANKAMREDDI TEJASRI', roll: '25JN5A4201', college: 'KIEW', branch: 'CSM', email: 'ankamredditejasri05@gmail.com' },
  { name: 'KAMBHAMPATI NAVEEN', roll: '25B25A4512', college: 'KIET', branch: 'AID', email: 'kambhampatinaveen5@gmail.com' },
  { name: 'SEELAMREDDI MUGDHA MOHANA SIVA PRIYA', roll: '25B25A4203', college: 'KIET', branch: 'CSM', email: 'sivapriyaseelamreddy@gmail.com' },
  { name: 'GUMMADIDALA UMA DEVI', roll: '25B25A4202', college: 'KIET', branch: 'CSM', email: 'umadevigummadidala@gmail.com' },
];

async function importStudents() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const defaultPassword = await bcrypt.hash('1234', 10);
  let inserted = 0, skipped = 0;

  for (const s of studentData) {
    const email = s.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) { console.log('SKIP:', email); skipped++; continue; }

    const dept = s.branch;
    const batch = getBatch(s.roll);
    const avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name) + '&background=7c3aed&color=fff&size=150';

    const user = await User.create({
      name: s.name.trim(), email, phone: '', passwordHash: defaultPassword,
      role: 'student', status: 'ACTIVE', last_login: new Date(),
      department: branchToDept[s.branch] || s.branch,
      batch, avatar
    });

    await Student.create({
      userId: user._id, name: s.name.trim(), email, phone: '',
      rollNumber: s.roll, department: dept,
      batch, gpa: '0.0', status: 'ACTIVE',
      last_login: new Date(), avatar
    });

    console.log('INSERTED:', s.name, '|', email);
    inserted++;
  }

  console.log('\n=== DONE ===');
  console.log('Inserted:', inserted, '| Skipped:', skipped);
  process.exit(0);
}

importStudents().catch(e => { console.error(e.message); process.exit(1); });
