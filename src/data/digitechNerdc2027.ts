import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const DIGITECH_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Digital Technologies',
    kicker: 'NERDC Year 1 · Computer Architecture, Binary/Hex, Media Encoding, OS & Algorithms',
    description:
      'Computing generations, Von Neumann architecture, I/O & sensors, memory/storage units, binary/octal/hex conversions, two’s complement arithmetic, ASCII/Unicode & media sizing, operating systems, flowcharts & translators.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Digital Technologies',
    kicker: 'NERDC Year 2 · Logic Gates, Fetch–Decode–Execute, Data Structures, Web, SDLC & Networking',
    description:
      'Boolean algebra & logic gates, CPU registers & clock cycles, arrays/stacks/queues & binary search, modular & OOP design, HTML5/CSS/DOM, SDLC models, network topologies, OSI/TCP-IP, IPv4 subnetting & cloud models.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Digital Technologies',
    kicker: 'NERDC Year 3 · Cybersecurity, Cryptography, NDPA Law, IoT/Robotics, AI/ML, APIs & Reliability',
    description:
      'Malware & network defense, symmetric/asymmetric encryption & hashing, Nigeria Data Protection Act (NDPA), microcontrollers & IoT, machine learning fundamentals, REST/JSON APIs, Git & Big-O, 5G wireless & MTBF availability.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Digital Technologies (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Digital Technologies & Computer Studies curriculum across Hardware Systems, Data Representation, Software & Coding, Networks & Cloud, and Cybersecurity & Emerging Tech.',
  },
];

export type DigiTechDomainId =
  | 'systems'
  | 'representation'
  | 'software'
  | 'networks'
  | 'cyber';

export interface DigiTechNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Computer Architecture, Logic & Embedded Systems'
    | 'Data Representation, Number Bases & Media Encoding'
    | 'Algorithms, Software Engineering & Web Development'
    | 'Computer Networks, Protocols & Cloud Infrastructure'
    | 'Cybersecurity, Data Governance & Emerging Technologies';
  order: number;
  domain: DigiTechDomainId;
  keywords: string[];
}

export const DIGITECH_NERDC_MAP: Record<string, DigiTechNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'dt-computing-evolution': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 1,
    domain: 'systems',
    keywords: ['abacus', 'napier bones', 'pascaline', 'analytical engine', 'babbage', 'lovelace', 'vacuum tubes', 'transistors', 'integrated circuits', 'microprocessor', 'vlsi'],
  },
  'dt-hardware-architecture': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 2,
    domain: 'systems',
    keywords: ['von neumann', 'stored program', 'alu', 'control unit', 'motherboard', 'chipset', 'pcie', 'cmos', 'bios', 'uefi', 'psu'],
  },
  'dt-input-output-peripherals': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 3,
    domain: 'systems',
    keywords: ['ocr', 'omr', 'micr', 'barcode', 'rfid', 'biometric', 'sensors', 'actuators', 'oled', 'inkjet', 'laser printer', '3d printer'],
  },
  'dt-memory-storage': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 4,
    domain: 'systems',
    keywords: ['sram', 'dram', 'cache', 'rom', 'prom', 'eprom', 'eeprom', 'hdd', 'nvme ssd', 'flash', 'optical disc', 'kibibyte', 'mebibyte'],
  },
  'dt-number-systems': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Representation, Number Bases & Media Encoding',
    order: 5,
    domain: 'representation',
    keywords: ['binary', 'octal', 'decimal', 'hexadecimal', 'radix', 'repeated division', 'positional weight', 'nibble', 'fractional binary'],
  },
  'dt-binary-arithmetic': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Representation, Number Bases & Media Encoding',
    order: 6,
    domain: 'representation',
    keywords: ['binary addition', 'ones complement', 'twos complement', 'overflow', 'underflow', 'sign and magnitude', 'bitwise shift', 'fixed point', 'floating point'],
  },
  'dt-data-encoding-media': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Representation, Number Bases & Media Encoding',
    order: 7,
    domain: 'representation',
    keywords: ['ascii', 'extended ascii', 'unicode', 'utf-8', 'bitmap', 'color depth', 'resolution', 'sample rate', 'bit depth', 'nyquist', 'lossless', 'lossy'],
  },
  'dt-system-software-os': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 8,
    domain: 'software',
    keywords: ['operating system', 'kernel', 'process scheduling', 'virtual memory', 'paging', 'interrupt', 'device driver', 'rtos', 'cli', 'gui', 'utility software'],
  },
  'dt-algorithms-flowcharts': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 9,
    domain: 'software',
    keywords: ['algorithm', 'finiteness', 'unambiguity', 'pseudocode', 'flowchart symbols', 'decision diamond', 'trace table', 'dry run'],
  },
  'dt-programming-fundamentals': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 10,
    domain: 'software',
    keywords: ['machine code', 'assembly', 'high-level language', 'assembler', 'compiler', 'interpreter', 'sequence', 'selection', 'iteration', 'syntax error', 'logic error'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'dt-boolean-logic-gates': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 1,
    domain: 'systems',
    keywords: ['and gate', 'or gate', 'not gate', 'nand', 'nor', 'xor', 'xnor', 'universal gate', 'de morgan', 'half adder', 'full adder', 'truth table'],
  },
  'dt-cpu-fetch-execute': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 2,
    domain: 'systems',
    keywords: ['program counter', 'mar', 'mdr', 'cir', 'accumulator', 'address bus', 'data bus', 'control bus', 'clock speed', 'pipelining', 'multicore'],
  },
  'dt-data-structures-arrays': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 3,
    domain: 'software',
    keywords: ['1d array', '2d array', 'stack lifo', 'queue fifo', 'push and pop', 'linear search', 'binary search', 'bubble sort', 'insertion sort'],
  },
  'dt-modular-oop-coding': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 4,
    domain: 'software',
    keywords: ['procedure', 'function', 'local scope', 'global scope', 'recursion', 'base case', 'encapsulation', 'inheritance', 'polymorphism', 'abstraction'],
  },
  'dt-web-technologies': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 5,
    domain: 'software',
    keywords: ['html5', 'semantic tags', 'css box model', 'specificity', 'responsive design', 'dom', 'javascript events', 'wcag accessibility', 'seo'],
  },
  'dt-sdlc-software-eng': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 6,
    domain: 'software',
    keywords: ['sdlc', 'feasibility', 'waterfall', 'agile', 'scrum', 'prototyping', 'alpha testing', 'beta testing', 'normal boundary extreme data', 'cutover'],
  },
  'dt-network-topologies-media': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 7,
    domain: 'networks',
    keywords: ['pan', 'lan', 'man', 'wan', 'star topology', 'mesh', 'bus', 'ring', 'utp', 'stp', 'coaxial', 'fiber optic', 'attenuation', 'simplex', 'duplex'],
  },
  'dt-osi-tcpip-protocols': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 8,
    domain: 'networks',
    keywords: ['nic', 'mac address', 'switch', 'router', 'gateway', 'osi model', 'tcp', 'udp', 'http', 'https', 'tls', 'smtp', 'imap', 'dhcp'],
  },
  'dt-ip-addressing-dns': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 9,
    domain: 'networks',
    keywords: ['ipv4', 'ipv6', 'cidr', 'subnet mask', 'usable hosts', 'public vs private ip', 'nat', 'loopback', 'dns resolution', 'packet switching'],
  },
  'dt-internet-cloud-computing': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 10,
    domain: 'networks',
    keywords: ['url', 'isp', 'ixpn', 'iaas', 'paas', 'saas', 'public cloud', 'private cloud', 'hybrid cloud', 'virtualization', 'cdn', 'edge computing'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'dt-cybersecurity-threats': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 1,
    domain: 'cyber',
    keywords: ['cia triad', 'virus', 'worm', 'trojan', 'ransomware', 'spyware', 'rootkit', 'phishing', 'ddos', 'mitm', 'sql injection', 'xss', 'zero-day'],
  },
  'dt-cryptography-auth': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 2,
    domain: 'cyber',
    keywords: ['symmetric encryption', 'aes', 'asymmetric encryption', 'rsa', 'public key', 'private key', 'sha-256', 'salted hash', 'digital signature', 'pki', 'mfa', 'firewall'],
  },
  'dt-data-privacy-ndpr': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 3,
    domain: 'cyber',
    keywords: ['ndpa 2023', 'ndpc', 'data controller', 'data subject', 'lawful consent', 'cybercrimes act', 'copyright', 'open source', 'mit', 'gpl', 'digital divide'],
  },
  'dt-embedded-iot-robotics': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Computer Architecture, Logic & Embedded Systems',
    order: 4,
    domain: 'systems',
    keywords: ['microcontroller', 'adc', 'dac', 'pwm', 'open loop', 'closed loop feedback', 'iot', 'mqtt', 'actuators', 'degrees of freedom', 'autonomous'],
  },
  'dt-ai-machine-learning': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 5,
    domain: 'cyber',
    keywords: ['artificial intelligence', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'overfitting', 'neural network', 'nlp', 'computer vision', 'algorithmic bias'],
  },
  'dt-database-web-backends': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 6,
    domain: 'networks',
    keywords: ['three-tier architecture', 'rest api', 'http methods', 'status codes', 'json', 'xml', 'stateless', 'cookies', 'jwt', 'webhooks'],
  },
  'dt-version-control-devops': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algorithms, Software Engineering & Web Development',
    order: 7,
    domain: 'software',
    keywords: ['git', 'commit', 'branch', 'merge conflict', 'pull request', 'big-o notation', 'time complexity', 'space complexity', 'unit testing', 'ci cd'],
  },
  'dt-wireless-mobile-5g': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Networks, Protocols & Cloud Infrastructure',
    order: 8,
    domain: 'networks',
    keywords: ['wi-fi 802.11', 'wpa3', 'bluetooth ble', 'nfc', '4g lte', '5g millimeter wave', 'latency', 'leo satellite', 'vsat', 'gps'],
  },
  'dt-system-reliability-fault': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 9,
    domain: 'cyber',
    keywords: ['mtbf', 'mttr', 'availability', 'five nines', 'raid 0', 'raid 1', 'raid 5', 'ups', 'rpo', 'rto', 'failover', 'load balancing'],
  },
  'dt-emerging-tech-careers': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Cybersecurity, Data Governance & Emerging Technologies',
    order: 10,
    domain: 'cyber',
    keywords: ['blockchain', 'immutable ledger', 'smart contract', 'qubit', 'superposition', 'ar vr', 'e-waste', 'green computing', 'nitda', 'cpon'],
  },
};

export function getDigiTechClassMeta(classId?: ChemClassId): ChemClassMeta {
  return DIGITECH_CLASSES.find((c) => c.id === (classId || 'all')) || DIGITECH_CLASSES[3];
}

export function filterDigiTechTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => DIGITECH_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (DIGITECH_NERDC_MAP[a.id]?.order ?? 99) - (DIGITECH_NERDC_MAP[b.id]?.order ?? 99));
}
