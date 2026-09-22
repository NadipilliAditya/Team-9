require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Alumni = require('./src/models/Alumni');

// Alumni data from Google Sheet - cleaned and parsed
const alumniData = [
  { name: 'PAVANI KADARI', email: 'kadaripavani1@gmail.com', phone: '9347132534', rollNumber: '23JN5A4501', branch: 'AID', college: 'KIEW', company: 'OHC PUPILFIRST' },
  { name: 'ARAVIND SWAMY MAJJURI', email: 'aravindswamymajjuri143@gmail.com', phone: '9492113371', rollNumber: '22B21A4526', branch: 'AID', college: 'KIET', company: 'OHC PUPILFIRST' },
  { name: 'PADMASRI AMBATI', email: 'padmasriambati2004@gmail.com', phone: '9533318222', rollNumber: '226Q1A4505', branch: 'AID', college: 'KIEK', company: 'OHC PUPILFIRST' },
  { name: 'MOHAN SUNKARA', email: 'mohansunkara963@gmail.com', phone: '9182622919', rollNumber: '22B21A4425', branch: 'CSD', college: 'KIET', company: 'MOJALOOP' },
  { name: 'DURGA PRASAD KORUKONDA', email: 'prasad7288033@gmail.com', phone: '7288033615', rollNumber: '22B21A4541', branch: 'AID', college: 'KIET', company: 'MOJALOOP' },
  { name: 'VEERENDRA REVU', email: 'veerendrarevu@gmail.com', phone: '8367670706', rollNumber: '22B21A44A6', branch: 'CSD', college: 'KIET', company: 'MOJALOOP' },
  { name: 'JOTHSNA', email: 'shanmukharaopandraki@gmail.com', phone: '9652311572', rollNumber: '22JN1A4580', branch: 'AID', college: 'KIEW', company: 'MOJALOOP' },
  { name: 'AKSHAY DEEPAK', email: 'akshaydeepakm@gmail.com', phone: '6301902632', rollNumber: '22B21A4344', branch: 'CAI', college: 'KIET', company: 'PIRAMAL SWASTHYA' },
  { name: 'YADLA UMA SEERSHIKA', email: 'umaseershika@gmail.com', phone: '8978317898', rollNumber: '22B21A4505', branch: 'AID', college: 'KIET', company: 'PIRAMAL SWASTHYA' },
  { name: 'PRASANTHI BOLLA', email: 'prasanthibolla29@gmail.com', phone: '6301168231', rollNumber: '22JN1A45A3', branch: 'AID', college: 'KIEW', company: 'PIRAMAL SWASTHYA' },
  { name: 'KOPPIREDDY DURGA PRASAD', email: 'prasad8790237@gmail.com', phone: '8790237365', rollNumber: '22B21A45A1', branch: 'AID', college: 'KIET', company: 'PIRAMAL SWASTHYA' },
  { name: 'BOMBOTHULA DWARAKA SRI PRADEEP', email: 'b.saipradeep456@gmail.com', phone: '6305259617', rollNumber: '226Q1A4407', branch: 'CSD', college: 'KIEK', company: 'PIRAMAL SWASTHYA' },
  { name: 'SAI SATWIKA', email: 'saisatwikadhupam@gmail.com', phone: '9391345768', rollNumber: '22B21A4470', branch: 'CSD', college: 'KIET', company: 'PIRAMAL SWASTHYA' },
  { name: 'KARTHIK VADLADI', email: 'karthikvadladi09@gmail.com', phone: '9014395457', rollNumber: '22B21A4539', branch: 'AID', college: 'KIET', company: 'PIRAMAL SWASTHYA' },
  { name: 'KALLEPALLI SAI AKHIL', email: 'akhilkallepalli8@gmail.com', phone: '9030421268', rollNumber: '226Q1A4411', branch: 'CSD', college: 'KIEK', company: 'PIRAMAL SWASTHYA' },
  { name: 'GUDDANTI SAI VARSHITHA', email: 'saivarshithaguddanti2004@gmail.com', phone: '8374421327', rollNumber: '22JN1A4599', branch: 'AID', college: 'KIEW', company: 'SMART CITY RESEARCH CENTRE - IIIT H' },
  { name: 'KUNCHALA YAMINI SRI', email: 'kunchala.yaminisri@gmail.com', phone: '7207242276', rollNumber: '22JN1A4323', branch: 'CAI', college: 'KIEW', company: 'SMART CITY RESEARCH CENTRE - IIIT H' },
  { name: 'P CH NVS SRAVAN KUMAR', email: 'pollisettisravankumar@gmail.com', phone: '9059686788', rollNumber: '22B21A4231', branch: 'CSM', college: 'KIET', company: 'PRODUCT LABS - IIIT H' },
  { name: 'KADALI DURGA SIVA SANKAR PRASAD', email: 'prasadkadali824@gmail.com', phone: '7569662165', rollNumber: '22B21A4544', branch: 'AID', college: 'KIET', company: 'PRODUCT LABS - IIIT H' },
  { name: 'JYOTHIKA KANCHARLA', email: 'jyothika1453@gmail.com', phone: '8886577855', rollNumber: '22JN1A4591', branch: 'AID', college: 'KIEW', company: 'PRODUCT LABS - IIIT H' },
  { name: 'PULAGAM ABHINAYA', email: 'abhinayapulagam@gmail.com', phone: '9177256349', rollNumber: '22JN1A4597', branch: 'AID', college: 'KIEW', company: 'PRODUCT LABS - IIIT H' },
  { name: 'ABHINAYASRI SWARNA', email: 'abhinayaswarna@gmail.com', phone: '9014969623', rollNumber: '22B21A4513', branch: 'AID', college: 'KIET', company: 'LANGUAGE TRANSLATION RESEARCH CENTRE - IIIT H' },
  { name: 'KASULA VENKATA MANASA', email: 'kasulamanasamanasa@gmail.com', phone: '9059963054', rollNumber: '22B21A4304', branch: 'CAI', college: 'KIET', company: 'PLANET READ' },
  { name: 'MADAVARAPU SAI HARSHAVARDHAN', email: 'harshavardhan77099@gmail.com', phone: '7702754317', rollNumber: '22B21A4227', branch: 'CSM', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'KANURI LAKSHMI PRASANNA', email: 'lakshmiprasannakanuri@gmail.com', phone: '9642104868', rollNumber: '22B21A4405', branch: 'CSD', college: 'KIET', company: 'SAMANVEY' },
  { name: 'CHALLA LAKSHMI PAVANI', email: 'challalakshmipavani90143@gmail.com', phone: '9866623645', rollNumber: '22JN1A4317', branch: 'CAI', college: 'KIEW', company: 'VISHWAM AI - IIIT H' },
  { name: 'VAISHNAVI PRABHALA', email: 'vaishnavi04.prabhala@gmail.com', phone: '8897455677', rollNumber: '22B21A43A4', branch: 'CAI', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'KANDA SWARNA RATHNA MADHURI', email: 'kandha815@gmail.com', phone: '9014955289', rollNumber: '22JN1A4539', branch: 'AID', college: 'KIEW', company: 'VISHWAM AI - IIIT H' },
  { name: 'K SAI TEJA', email: 'tejnaiduutejnaidukumpatla123@gmail.com', phone: '9014309517', rollNumber: '22B21A4562', branch: 'AID', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'MADDULA RUSHIKA SRITHA', email: 'rushikasrithamaddula2005@gmail.com', phone: '9949339391', rollNumber: '22B21A4509', branch: 'AID', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'DALIBOINA SATISH', email: 'satishdaliboina@gmail.com', phone: '9959905751', rollNumber: '22B21A45E1', branch: 'AID', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'P SAI RISHITHA', email: 'rishithapemmireddy@gmail.com', phone: '9154129145', rollNumber: '22JN1A45C8', branch: 'AID', college: 'KIEW', company: 'SAMANVEY' },
  { name: 'PAVANI NAGIREDDY', email: 'nagireddypavani3@gmail.com', phone: '9502969689', rollNumber: '22JN1A4202', branch: 'CSM', college: 'KIEW', company: 'VISHWAM AI - IIIT H' },
  { name: 'CHESETTI SAI JEEVANA JYOTHI', email: 'jeevanachesetti31@gmail.com', phone: '9951376197', rollNumber: '22B21A4519', branch: 'AID', college: 'KIET', company: 'VISHWAM AI - IIIT H' },
  { name: 'SHAIK RAHAMATH', email: 'shaikrahamath106@gmail.com', phone: '7729952923', rollNumber: '22JN1A4510', branch: 'AID', college: 'KIEW', company: '' },
  { name: 'SAI KUMAR', email: 'ksai33393@gmail.com', phone: '8008030674', rollNumber: '22B21A4423', branch: 'CSD', college: 'KIET', company: '' },
  { name: 'PASUPULETI KALYAN NAGU', email: 'pasupuletikalyannagu@gmail.com', phone: '6305030599', rollNumber: '22B21A4531', branch: 'AID', college: 'KIET', company: '' },
  { name: 'SOMAROUTHU NAGA BALAJI', email: 'somarouthubalaji@gmail.com', phone: '9391149375', rollNumber: '22B21A4342', branch: 'CAI', college: 'KIET', company: '' },
  { name: 'JALASRI NILAGIRI', email: 'neelagirijalasri@gmail.com', phone: '9392458332', rollNumber: '22B21A4506', branch: 'AID', college: 'KIET', company: '' },
  { name: 'KADIMI VENKATA SAI', email: 'vensai340@gmail.com', phone: '8125744340', rollNumber: '22B21A45F5', branch: 'AID', college: 'KIET', company: '' },
  { name: 'AKHILA BELUGULA', email: 'belugulaakhilanaidu@gmail.com', phone: '9110760316', rollNumber: '22JN1A4305', branch: 'CAI', college: 'KIEW', company: '' },
  { name: 'TURUBILLI GANAPATHI', email: 'turubilliganapathi8106@gmail.com', phone: '8106490856', rollNumber: '22B21A4471', branch: 'CSD', college: 'KIET', company: '' },
  { name: 'BAVYA TULASI DULAM', email: 'dulambavyatulasi@gmail.com', phone: '9390472906', rollNumber: '22B21A4511', branch: 'AID', college: 'KIET', company: '' },
  { name: 'VIJAY DASARI', email: 'vijaydasari483@gmail.com', phone: '9346515977', rollNumber: '22B21A4338', branch: 'CAI', college: 'KIET', company: '' },
];

const branchToDept = { AID: 'Artificial Intelligence & Data Science', CSD: 'Computer Science & Design', CAI: 'Computer Science & AI', CSM: 'Computer Science & Mathematics', CSE: 'Computer Science', IT: 'Information Technology' };

async function importAlumni() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');
  
  const defaultPassword = await bcrypt.hash('1234', 10);
  let inserted = 0, skipped = 0;
  
  for (const a of alumniData) {
    const email = a.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) { console.log('SKIP (exists):', email); skipped++; continue; }
    
    const dept = branchToDept[a.branch] || a.branch;
    const user = await User.create({
      name: a.name, email, phone: a.phone, passwordHash: defaultPassword,
      role: 'alumni', status: 'ACTIVE', last_login: new Date(),
      department: dept, company: a.company || '', designation: 'Intern',
      batch: '2026', location: '',
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(a.name) + '&background=4f46e5&color=fff&size=150'
    });
    await Alumni.create({
      userId: user._id, name: a.name, email, phone: a.phone,
      rollNumber: a.rollNumber, branch: a.branch, college: a.college,
      company: a.company || '', role: 'Intern', designation: 'Intern',
      ctc: '', batch: '2026', department: dept, location: '',
      status: 'ACTIVE', last_login: new Date(),
      mentorshipDomain: 'Software Development & Placement',
      engagementScore: 85, avatar: user.avatar
    });
    console.log('INSERTED:', email);
    inserted++;
  }
  
  console.log('\n=== DONE ===');
  console.log('Inserted:', inserted, '| Skipped (already exists):', skipped);
  process.exit(0);
}

importAlumni().catch(e => { console.error(e.message); process.exit(1); });
