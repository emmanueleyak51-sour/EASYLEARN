import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { DIGITECH_TOPICS_PART1 } from './digitechTopicsPart1';
import { DIGITECH_TOPICS_PART2 } from './digitechTopicsPart2';
import { DIGITECH_TOPICS_PART3 } from './digitechTopicsPart3';

interface DigiTechTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const DIGITECH_TEACH_TABLES: Record<string, DigiTechTableSpec> = {
  'dt-computing-evolution': {
    title: 'Five Electronic Computer Generations Comparison Matrix',
    headers: ['Generation & Era', 'Core Switching Element', 'Hallmark Systems & Software'],
    rows: [
      ['1st Gen (1940–1956)', 'Vacuum Tubes (Thermionic Valves)', 'ENIAC, UNIVAC I · Machine code & magnetic drums'],
      ['2nd Gen (1956–1963)', 'Discrete Transistors', 'IBM 1401 · Assembly, FORTRAN, COBOL & magnetic core'],
      ['3rd Gen (1964–1971)', 'Integrated Circuits (SSI/MSI Chips)', 'IBM System/360 · Multiprogramming OS, keyboards/CRTs'],
      ['4th & 5th Gen (1971+)', 'VLSI Microprocessors → ULSI / AI', 'Intel 4004, PCs, Cloud, Multicore GPUs & Neural accelerators'],
    ],
  },
  'dt-hardware-architecture': {
    title: 'Von Neumann Subsystems & Motherboard Architecture',
    headers: ['Subsystem', 'Primary Role', 'Architectural Watchout'],
    rows: [
      ['Control Unit (CU)', 'Decodes opcodes & issues timing/control signals', 'Directs traffic; does NOT compute arithmetic itself'],
      ['ALU', 'Executes arithmetic (+, −) & logic (AND, OR, ==, <)', 'Updates status flags (Zero, Carry, Sign, Overflow)'],
      ['Von Neumann vs Harvard', 'Shared single RAM/bus vs Split Instruction/Data buses', 'Shared bus creates the Von Neumann bottleneck'],
      ['PSU & UEFI Firmware', 'AC → DC (+12V/+5V/+3.3V) · Non-volatile POST boot', 'CMOS coin battery backs RTC clock when unplugged'],
    ],
  },
  'dt-input-output-peripherals': {
    title: 'Source-Data Capture, Sensors & Output Peripherals',
    headers: ['Technology', 'Operating Principle', 'Signature Use Case'],
    rows: [
      ['OMR vs OCR vs MICR', 'Shaded ovals vs Editable text vs Magnetic iron ink', 'Objective scripts (OMR), Scanned docs (OCR), Cheques (MICR)'],
      ['RFID vs Barcode/QR', 'Radio-frequency waves vs Optical line-of-sight', 'RFID reads through packaging without line-of-sight'],
      ['Sensors + ADC', 'Measure physical analog values → binary via ADC', 'Thermistor, LDR, Moisture, Ultrasonic, Piezo pressure'],
      ['Laser vs Thermal vs OLED', 'Electrostatic toner vs Heated paper vs Self-lit pixels', 'OLED turns black pixels completely OFF (true contrast)'],
    ],
  },
  'dt-memory-storage': {
    title: 'Memory Hierarchy & Binary Storage Scale',
    headers: ['Tier / Unit', 'Volatility & Mechanism', 'Speed / Exact Equivalence'],
    rows: [
      ['SRAM (L1/L2/L3 Cache)', 'Volatile · 6-transistor flip-flop latches', 'Sub-ns to ~5 ns · Never needs capacitor refresh'],
      ['DRAM (Main System RAM)', 'Volatile · 1 transistor + 1 leaky capacitor', '~60–90 ns · Must be refreshed thousands of times/s'],
      ['EEPROM / NVMe SSD', 'Non-Volatile · NAND floating-gate flash cells', 'Zero moving parts, shockproof; never defragment SSDs!'],
      ['IEC Binary Units', '1 B = 8 bits = 2 nibbles · Step = ×1,024 (2¹⁰)', '1 KiB = 1,024 B · 1 MiB = 1,024 KiB · 1 GiB = 1,024 MiB'],
    ],
  },
  'dt-number-systems': {
    title: 'Positional Number Systems & Direct Bit-Grouping Rules',
    headers: ['Base (Radix)', 'Valid Digits', 'Direct Binary Shortcut'],
    rows: [
      ['Binary (Base 2)', '0, 1', 'Positional powers: … 32, 16, 8, 4, 2, 1 . ½, ¼, ⅛'],
      ['Octal (Base 8)', '0, 1, 2, 3, 4, 5, 6, 7', 'Group 3 bits per octal digit from radix point outward'],
      ['Decimal (Base 10)', '0–9', 'Divide integer by r (bottom-up); multiply fraction by r (top-down)'],
      ['Hexadecimal (Base 16)', '0–9, A(10)–F(15)', 'Group 4 bits (1 nibble) per hex digit; 2 hex digits = 1 Byte'],
    ],
  },
  'dt-binary-arithmetic': {
    title: 'Two’s Complement Arithmetic, Shifts & Floating-Point',
    headers: ['Operation / Format', 'Exact Rule', 'Critical Overflow / Rounding Trap'],
    rows: [
      ['Two’s Complement (−X)', 'Invert all bits (~X) and add 1', '8-bit signed range: −128 to +127 (unique zero!)'],
      ['Signed Subtraction A − B', 'Compute A + (Two’s Complement of B)', 'Same-sign inputs yielding opposite-sign sum = OVERFLOW'],
      ['Bitwise Shifts', 'X << k = X × 2ᵏ · Arith X >> k = ⌊X ÷ 2ᵏ⌋', 'Arithmetic right shift copies MSB sign bit'],
      ['Floating-Point', '(−1)^S × Mantissa × 2^Exponent', 'More exponent bits = wider range; 0.1₁₀ repeats in base 2'],
    ],
  },
  'dt-data-encoding-media': {
    title: 'Text Encoding, Graphics, Audio & Compression Guide',
    headers: ['Media Domain', 'Formula / Standard', 'Key Engineering Distinction'],
    rows: [
      ['ASCII vs UTF-8 Unicode', '7-bit (128 chars) vs 1–4 bytes (1.1M+ chars)', 'UTF-8 encodes ₦, Yoruba/Igbo/Hausa marks & emojis'],
      ['Bitmap vs Vector', 'Bitmap Bytes = (W × H × b) ÷ 8 (2ᵇ = colors)', 'Vector (SVG) stores math paths → scales with zero blur'],
      ['PCM Digital Audio', 'Bytes = (f_s × b × t × c) ÷ 8 · f_s ≥ 2f_max', 'Stereo uses c = 2 channels; Nyquist prevents aliasing'],
      ['Lossless vs Lossy', 'ZIP/PNG/FLAC (exact) vs JPEG/MP3/MP4 (approx)', 'NEVER use lossy compression on code, text, or databases!'],
    ],
  },
  'dt-system-software-os': {
    title: 'Operating System Kernel Subsystems & Interfaces',
    headers: ['OS Responsibility', 'Core Mechanism', 'Operational Watchout'],
    rows: [
      ['Process Scheduling', 'Round-Robin / Priority time slices', 'Deadlock occurs when processes circularly hold & wait'],
      ['Virtual Memory', 'Swaps inactive RAM pages to SSD/HDD pagefile', 'Extends capacity, NOT speed — overuse causes thrashing'],
      ['Interrupts (IRQ)', 'Saves PC/flags on stack → runs ISR → restores', 'Replaces wasteful CPU busy-waiting (polling)'],
      ['RTOS vs CLI vs GUI', 'Deterministic deadlines (RTOS) · Scriptable CLI', 'Device Drivers bridge OS calls to specific hardware'],
    ],
  },
  'dt-algorithms-flowcharts': {
    title: 'Standard ISO Flowchart Symbols & Loop Semantics',
    headers: ['Symbol / Construct', 'Geometric Shape / Syntax', 'Execution Rule'],
    rows: [
      ['Start / Stop', 'Oval (Terminator)', 'Every finite algorithm has clear entry and termination'],
      ['Input / Output', 'Parallelogram (`INPUT x`, `OUTPUT y`)', 'Never confuse with Rectangle!'],
      ['Process / Assignment', 'Rectangle (`sum ← sum + x`)', 'Initialize sums to 0 and products/factorials to 1'],
      ['Decision & Loops', 'Diamond (`Yes` / `No` branches)', '`REPEAT…UNTIL` runs ≥1 time; `WHILE` runs ≥0 times'],
    ],
  },
  'dt-programming-fundamentals': {
    title: 'Language Translators & Program Bug Classification',
    headers: ['Concept', 'Behaviour', 'Diagnostic Signature'],
    rows: [
      ['Assembler', 'Translates 2GL assembly mnemonics → machine code', 'CPU-specific (x86 vs ARM), 1-to-1 hardware control'],
      ['Compiler vs Interpreter', 'Whole-program binary ahead-of-time vs Line-by-line', 'Compiler hides source & runs fast; Interpreter stops at 1st bug'],
      ['DIV & MOD Operators', 'Integer quotient (`17 DIV 5 = 3`) & remainder (`2`)', 'Store leading-zero phone numbers as `String`, NOT `Int`!'],
      ['Syntax / Runtime / Logic', 'Grammar error / Crash (`÷0`) / Wrong formula', 'Logic errors compile & run cleanly yet output wrong answers'],
    ],
  },
  'dt-boolean-logic-gates': {
    title: 'Digital Logic Gates, De Morgan’s Laws & Adders',
    headers: ['Gate / Circuit', 'Boolean Expression', 'Truth-Table Highlight'],
    rows: [
      ['AND · OR · NOT', 'A · B &nbsp;|&nbsp; A + B &nbsp;|&nbsp; ¬A', 'AND = 1 iff all 1 · OR = 0 iff all 0'],
      ['NAND & NOR (Universal)', '¬(A · B) = ¬A + ¬B &nbsp;|&nbsp; ¬(A + B) = ¬A · ¬B', 'Either gate type alone can build ANY digital circuit'],
      ['XOR & XNOR', 'A ⊕ B = A·¬B + ¬A·B &nbsp;|&nbsp; ¬(A ⊕ B)', 'XOR = 1 iff inputs differ (1 ⊕ 1 = 0!)'],
      ['Half vs Full Adder', 'HA: S = A⊕B, C = A·B · FA adds C_in (2 HA + OR)', 'n-input circuit has 2ⁿ truth-table rows'],
    ],
  },
  'dt-cpu-fetch-execute': {
    title: 'CPU Special Registers & System Bus Architecture',
    headers: ['Register / Bus', 'Direction / Role', 'FDE Cycle Transfer'],
    rows: [
      ['PC & MAR', 'Next instruction address → Active RAM address', 'Fetch Step 1: `MAR ← [PC]`'],
      ['MDR & CIR', 'Data-bus buffer → Decoded instruction holder', 'Fetch Steps 2–3: `MDR ← Mem[MAR]; PC ← PC+1; CIR ← [MDR]`'],
      ['Address Bus', 'UNIDIRECTIONAL (CPU → RAM/I/O)', 'Width `a` bits addresses `2ᵃ` memory locations'],
      ['Data & Control Buses', 'BIDIRECTIONAL', 'Data bus sets word transfer width; Control carries R/W & IRQ'],
    ],
  },
  'dt-data-structures-arrays': {
    title: 'Core Data Structures, Searching & Sorting Benchmarks',
    headers: ['Structure / Algorithm', 'Access / Order Rule', 'Worst-Case Time & Precondition'],
    rows: [
      ['Array vs Record', 'Homogeneous 0..N−1 contiguous vs Mixed fields', '`A[i]` lookup is `O(1)` constant time'],
      ['Stack vs Queue', 'Stack = LIFO (`PUSH/POP`) · Queue = FIFO', 'Stack: Call stack / Undo · Queue: Print spooler / Buffers'],
      ['Linear vs Binary Search', 'Sequential scan vs Midpoint halving', 'Binary Search is `O(log₂ N)` ONLY on SORTED arrays!'],
      ['Bubble / Insertion / Merge', 'Adjacent swaps / Prefix insert / Divide & Merge', 'Bubble/Insertion `O(N²)` vs Merge Sort guaranteed `O(N log N)`'],
    ],
  },
  'dt-modular-oop-coding': {
    title: 'Subroutines, Recursion & Four Pillars of OOP',
    headers: ['Pillar / Concept', 'Technical Definition', 'Engineering Benefit / Trap'],
    rows: [
      ['Function vs Procedure', 'Returns value vs Executes side-effect task', 'Prefer `local` variables over `global` state'],
      ['Recursion', 'Function calls itself toward a Base Case', 'Missing Base Case crashes Call Stack (`Stack Overflow`)!'],
      ['Encapsulation & Abstraction', '`private` fields + `public` methods; hide internals', 'Enforces invariants safely inside the Class'],
      ['Inheritance & Polymorphism', 'Subclass extends Superclass; overrides methods', 'Uniform interface (`shape.getArea()`) dispatches dynamically'],
    ],
  },
  'dt-web-technologies': {
    title: 'Frontend Web Stack: HTML5, CSS Box Model & DOM',
    headers: ['Layer', 'Core Mechanism', 'Production Best Practice'],
    rows: [
      ['Semantic HTML5', '`<header>`, `<nav>`, `<main>`, `<label>`, `alt`', 'Native `<button>` gives free keyboard & screen-reader support'],
      ['CSS Box Model', 'Content → Padding → Border → Margin', '`box-sizing: border-box` keeps outer width fixed when padding'],
      ['CSS Specificity', 'Inline > `#id` > `.class` > `element`', 'Use external `.css` files + `@media` responsive Flexbox/Grid'],
      ['JS DOM & Validation', '`querySelector` + `addEventListener`', 'Client JS speeds UX; Server validation enforces true security!'],
    ],
  },
  'dt-sdlc-software-eng': {
    title: 'SDLC Methodologies, Test Data & Changeover Risk Matrix',
    headers: ['Dimension', 'Options', 'Selection Rule'],
    rows: [
      ['TELOS Feasibility', 'Technical, Economic, Legal, Operational, Schedule', 'Verify NDPA legal & ROI economic viability BEFORE coding'],
      ['Waterfall vs Agile', 'Linear frozen stages vs Iterative 2-week Sprints', 'Waterfall for fixed safety-critical; Agile for evolving UX'],
      ['Test Data Triad', 'Normal (`50`) · Boundary (`0, 100`) · Erroneous (`"abc"`)', 'Boundary values catch `<` vs `<=` off-by-one bugs'],
      ['System Changeover', 'Direct · Parallel · Pilot (1 site) · Phased (modules)', 'Parallel is safest (costliest); Direct is cheapest (riskiest)'],
    ],
  },
  'dt-network-topologies-media': {
    title: 'Network Topologies, Cabling Media & Bandwidth Laws',
    headers: ['Concept', 'Key Formula / Physics', 'Strengths & Limits'],
    rows: [
      ['Star vs Full Mesh', 'Star: central Switch · Mesh: `L = n(n−1) ÷ 2`', 'Star isolates single cable breaks; Mesh maximizes WAN uptime'],
      ['UTP Copper vs Fiber', 'Electrical twisted pairs (≤100 m) vs Glass TIR light', 'Fiber spans km at Tbps with ZERO EMI or lightning surge!'],
      ['Duplex Modes', 'Simplex (1-way) · Half (walkie) · Full (switched)', 'Modern switched Ethernet runs collision-free Full-Duplex'],
      ['Transfer Time', '`t = (File Bytes × 8) ÷ Bandwidth_bps`', 'Always multiply MegaBYTES by 8 to match Mbps!'],
    ],
  },
  'dt-osi-tcpip-protocols': {
    title: 'Network Devices, OSI Layers & TCP/IP Protocols',
    headers: ['Layer / Device', 'PDU & Addressing', 'Core Protocols & Behaviour'],
    rows: [
      ['L1 Hub vs L2 Switch', 'Bits (broadcast) vs Frames (48-bit MAC table)', 'Switches eliminate collisions by forwarding only to target port'],
      ['L3 Router (Network)', 'Packets (Logical IPv4 / IPv6 addresses)', 'Routes traffic BETWEEN distinct subnets and the Internet'],
      ['L4 Transport: TCP vs UDP', 'Segments (Port numbers)', 'TCP: reliable 3-way handshake · UDP: fast live VoIP/video'],
      ['L7 Application Suite', 'HTTPS (443), DNS, DHCP, SMTP, IMAP, SSH (22)', 'SMTP sends mail; IMAP syncs inbox across multiple devices'],
    ],
  },
  'dt-ip-addressing-dns': {
    title: 'IPv4/IPv6 Subnetting, NAT & Packet Switching',
    headers: ['Topic', 'Exact Rule / Formula', 'Key Watchout'],
    rows: [
      ['IPv4 vs IPv6', '32-bit (`0–255` octets) vs 128-bit (8 hex groups)', 'Any IPv4 octet > 255 (e.g. `192.168.260.1`) is INVALID!'],
      ['CIDR Usable Hosts', '`Usable = 2^(32 − prefix) − 2`', 'Subtract 2 for Network ID and Broadcast (`/24` → 254 hosts)'],
      ['Private IPs & NAT', '`10/8`, `172.16/12`, `192.168/16` · Loopback `127.0.0.1`', 'Router NAT shares 1 public ISP IP across private LAN hosts'],
      ['DNS & Packet Switching', 'Domain → IP (`A`/`AAAA`) · Dynamic independent hops', 'TCP sequence numbers reassemble out-of-order packets'],
    ],
  },
  'dt-internet-cloud-computing': {
    title: 'Cloud Service Models (IaaS / PaaS / SaaS) & Edge Delivery',
    headers: ['Model / Layer', 'What You Manage vs Provider', 'Canonical Examples'],
    rows: [
      ['IaaS (Infrastructure)', 'You manage OS, runtime & app; vendor runs VMs/disks', 'AWS EC2, Google Compute Engine, Azure Virtual Machines'],
      ['PaaS (Platform)', 'You deploy code + data; vendor manages OS & scaling', 'Cloud Run, App Engine, Heroku, Render'],
      ['SaaS (Software)', 'Turnkey browser/mobile app; vendor manages all', 'Google Workspace, Microsoft 365, Canva'],
      ['CDN, IXPN & Edge', 'Nearby cache PoPs, local peering & on-device compute', 'Slashes latency & keeps safety-critical loops working offline'],
    ],
  },
  'dt-cybersecurity-threats': {
    title: 'Malware Taxonomy, Attack Vectors & Engineering Defenses',
    headers: ['Threat', 'Mechanism & CIA Impact', 'Primary Countermeasure'],
    rows: [
      ['Virus vs Worm vs Trojan', 'Host-attached vs Self-propagating vs Fake utility', 'Patch OS, EDR antivirus, never run untrusted binaries'],
      ['Ransomware', 'Encrypts files for extortion (Availability)', 'Offline air-gapped / immutable 3-2-1 backups + patching'],
      ['Phishing / Smishing / MitM', 'Deceptive links/SMS · Rogue Wi-Fi interception', 'Hardware/App MFA, verify domains, enforce HTTPS/TLS + VPN'],
      ['SQL Injection & XSS', 'Unescaped input executed as SQL or browser JS', 'Parameterized Queries (Prepared Statements) + CSP/escaping'],
    ],
  },
  'dt-cryptography-auth': {
    title: 'Encryption, Salted Hashing & Digital Signatures Matrix',
    headers: ['Primitive', 'Key / Direction Rule', 'Security Purpose'],
    rows: [
      ['Symmetric (AES-256)', 'Same shared secret key encrypts & decrypts', 'Ultra-fast bulk file, disk & TLS session encryption'],
      ['Asymmetric Confidentiality', 'Encrypt with Receiver’s PUBLIC key', 'Only Receiver’s secret PRIVATE key can decrypt'],
      ['Digital Signature', 'Sign hash with Sender’s PRIVATE key', 'Verified via Sender’s PUBLIC key (Authenticity + Non-repudiation)'],
      ['Salted Hash & MFA', 'One-way `Hash(Salt + Password)` + ≥2 factor types', 'Defeats rainbow tables; MFA mixes Know + Have + Are'],
    ],
  },
  'dt-data-privacy-ndpr': {
    title: 'Nigeria Data Protection Act (NDPA 2023) & Software Licenses',
    headers: ['Framework', 'Core Obligation', 'Practical Implication'],
    rows: [
      ['NDPA 2023 & NDPC', 'Lawfulness, Purpose Limitation & Data Minimization', 'Explicit opt-in consent (no pre-ticked boxes!); breach reporting'],
      ['Data Subject Rights', 'Access, Rectification, Erasure, Portability', 'Controller decides purpose; Processor acts on instructions'],
      ['Permissive OSS (MIT/Apache)', 'Open source with attribution; closed derivatives OK', 'Widely used in commercial & enterprise stacks'],
      ['Copyleft OSS (GNU GPL)', 'Distributed derivatives MUST also stay open GPL', 'Distinct from closed-source Freeware and Shareware trials'],
    ],
  },
  'dt-embedded-iot-robotics': {
    title: 'Embedded Control Loops, PWM, IoT & Robotics',
    headers: ['Concept', 'Operating Equation / Architecture', 'Real-World Example'],
    rows: [
      ['Microcontroller (MCU)', 'CPU + SRAM + Flash + ADC/GPIO on 1 chip', 'ESP32, STM32, ATmega in smart meters & appliances'],
      ['Open vs Closed Loop', 'Fixed timer vs `Error = Setpoint − Sensor` feedback', 'Toaster (Open-Loop) vs Thermostat AC / Drone IMU (Closed-Loop)'],
      ['PWM Duty Cycle', '`Duty (%) = (T_on ÷ T_period) × 100%`', 'Controls DC motor speed & LED brightness efficiently'],
      ['IoT MQTT & Robotics', 'Lightweight pub/sub broker · Sensors → MCU → End-Effector', 'Change default IoT passwords & isolate on a dedicated VLAN!'],
    ],
  },
  'dt-ai-machine-learning': {
    title: 'Machine Learning Paradigms & Responsible AI Guardrails',
    headers: ['Paradigm / Issue', 'Training Signal', 'Canonical Task & Watchout'],
    rows: [
      ['Supervised Classification', 'Labeled `(X, discrete class)` pairs', 'Spam filter, malaria slide diagnosis, fraud flagging'],
      ['Supervised Regression', 'Labeled `(X, continuous number)` pairs', 'Predicting crop yield (kg/ha) or solar kWh output'],
      ['Unsupervised & RL', 'Unlabeled patterns (`Clustering`) · Agent `Reward`', 'Customer segmentation (Unsupervised) · Robotics/Games (RL)'],
      ['Overfitting & Bias', '99% train vs 52% unseen test · Skewed training data', 'Always evaluate on held-out Test set & audit demographic fairness'],
    ],
  },
  'dt-database-web-backends': {
    title: '3-Tier REST APIs, HTTP Status Codes & JSON Rules',
    headers: ['Component', 'Standard Specification', 'Critical Backend Rule'],
    rows: [
      ['REST HTTP Verbs', '`GET` (read), `POST` (create), `PUT/PATCH`, `DELETE`', '`GET` must NEVER mutate/delete state; `PUT/DELETE` are idempotent'],
      ['HTTP Status Codes', '`200/201` OK · `400` Bad · `401` Auth · `403` Role · `404` · `500`', '`401` = log in first; `403` = logged in, insufficient permission'],
      ['JSON Syntax', 'Double-quoted keys `"k": v`, `true/false/null`, `[]`, `{}`', 'Lighter & faster to parse than verbose tag-based XML'],
      ['Session Security', '`HttpOnly; Secure; SameSite` cookies / Bearer JWT', 'NEVER ship database passwords or secret API keys in client JS!'],
    ],
  },
  'dt-version-control-devops': {
    title: 'Git Workflows, Big-O Complexity & CI/CD Pipeline',
    headers: ['Practice / Complexity', 'Order / Mechanism', 'Engineering Takeaway'],
    rows: [
      ['Git Branch & PR', '`branch` → `commit` → `Pull Request` → CI → `merge`', 'Merge conflict occurs ONLY on competing edits to the same lines'],
      ['Fast Big-O Classes', '`O(1)` Array/Hash < `O(log n)` BinSearch < `O(n)` Loop', 'Scales effortlessly to millions of items'],
      ['Heavy Big-O Classes', '`O(n log n)` MergeSort < `O(n²)` Nested < `O(2ⁿ)` Brute', '10× input makes `O(n²)` 100× slower; drop constants (`5n → O(n)`)'],
      ['Unit Tests & CI/CD', 'Automated function tests run on every commit', 'Failing unit tests block broken code from reaching Production'],
    ],
  },
  'dt-wireless-mobile-5g': {
    title: 'Wireless Spectrum, Cellular 5G & Satellite Comparison',
    headers: ['Technology', 'Range & Frequency Trade-Off', 'Latency / Ideal Use Case'],
    rows: [
      ['Wi-Fi 2.4 vs 5/6 GHz', '2.4 GHz: wall range · 5/6 GHz: multi-Gbps speed', 'Secure with WPA3; higher GHz attenuates faster through concrete'],
      ['NFC vs BLE', 'NFC: ~4 cm tap · BLE: ~10 m coin-cell wearables', 'NFC proximity protects contactless POS cards'],
      ['4G LTE vs 5G NR', '5G adds eMBB speed, ~1–5 ms URLLC & dense IoT', 'mmWave 5G needs dense small cells; Handover keeps calls live'],
      ['GEO vs LEO & GPS', 'GEO 35,786 km (~600 ms) vs LEO ~550 km (~30 ms)', 'GPS is passive receive-only trilateration from ≥ 4 satellites!'],
    ],
  },
  'dt-system-reliability-fault': {
    title: 'Availability, RAID Storage & Disaster Recovery Metrics',
    headers: ['Reliability Tool', 'Formula / Architecture', 'Critical Distinction'],
    rows: [
      ['Availability (%)', '`[MTBF ÷ (MTBF + MTTR)] × 100%`', '99.999% ("Five Nines") allows only ~5.26 min downtime/year'],
      ['RAID 0 vs 1 vs 5', 'Striping (0 fault tol!) · Mirror (50%) · Parity `(N−1)D`', 'RAID ≠ Backup! Deletions & ransomware mirror instantly'],
      ['UPS vs AVR vs Surge', 'Battery inverter (UPS) vs Voltage regulator vs Spike clip', 'UPS bridges blackouts cleanly until generator or safe shutdown'],
      ['RPO vs RTO & Hot Site', 'RPO = max data-age loss · RTO = max outage duration', 'Load Balancers + Hot-Site failover eliminate SPOFs'],
    ],
  },
  'dt-emerging-tech-careers': {
    title: 'Blockchain, Quantum Qubits, Green ICT & Nigerian Bodies',
    headers: ['Domain', 'Core Principle', 'Real-World Governance'],
    rows: [
      ['Blockchain & Smart Contracts', 'SHA-256 `prevHash` chain + PoS consensus', 'Tamper-evident multi-party ledger (not for private erasable CRUD)'],
      ['Quantum Computing', 'Qubit superposition & entanglement', 'Threatens RSA/ECC → motivates Post-Quantum Lattice Crypto'],
      ['Green ICT & E-Waste', 'Virtualization, solar PUE & certified WEEE recycling', 'Never burn e-waste (Lead, Mercury, Cadmium neurotoxins!)'],
      ['Nigerian ICT Bodies', 'NITDA (IT policy), NCC (telecom), CPN & NDPC', 'White-Hat Penetration Testers audit systems with authorization'],
    ],
  },
};

function shuffleMcq(
  key: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  const order = perm(key, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

function buildInteractiveForDigiTechTopic(topic: Topic): InteractiveLesson {
  const tableSpec = DIGITECH_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Engineering Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Systems, Logic & Computing Rules',
      };
      beats.push(ideaBeat);

      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>Trap:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Summary Table',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      const fadeSteps = part.ex.steps.map((st, sIdx) => {
        const isLast = sIdx === part.ex.steps.length - 1;
        if (isLast && part.ex.why) {
          const [, wq, wo, wfb] = part.ex.why;
          return {
            m: st[0],
            why: st[1],
            whyQ: {
              q: wq,
              o: wo,
              a: 0,
              fb: wfb,
            },
          };
        }
        return {
          m: st[0],
          why: st[1],
        };
      });

      beats.push({
        k: 'fade',
        kl: 'Worked Engineering Walkthrough',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Engineering Flaw',
          title: `Audit ${topic.spot.who}’s Solution`,
          who: topic.spot.who,
          q: topic.spot.q,
          lines: topic.spot.lines,
          bad: topic.spot.bad,
          okfb: topic.spot.okfb,
          o: sp.o,
          a: sp.a,
          fb: sp.fb || ['', '', '', ''],
          h: topic.spot.h,
          fix: topic.spot.fix,
        });
      }

      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Exact! ${part.tryit.e}`
          : `Review the step-by-step analysis: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Mastery Check',
        title: `Your Turn — ${part.title}`,
        q: part.tryit.q,
        o: cp.o,
        a: cp.a,
        fb: cp.fb || defaultFb,
        h: [part.tryit.h],
      });

      return {
        title: part.title,
        beats,
      };
    }),
  };
}

export function buildDigiTechCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...DIGITECH_TOPICS_PART1,
    ...DIGITECH_TOPICS_PART2,
    ...DIGITECH_TOPICS_PART3,
  ];

  const topics: Topic[] = rawTopics.map((topic) => ({
    ...topic,
    qs: topic.qs.map((q, qIdx) => {
      const p = shuffleMcq(`q|${topic.id}|${qIdx}`, q.o, q.a, q.w);
      return {
        ...q,
        o: p.o,
        a: p.a,
        w: p.fb,
      };
    }),
  }));

  const il: Record<string, InteractiveLesson> = {};
  for (const t of rawTopics) {
    il[t.id] = buildInteractiveForDigiTechTopic(t);
  }

  return { topics, il };
}
