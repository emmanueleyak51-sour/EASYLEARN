import type { FormulaRearrangement } from './chemFormulas';

export type DigiTechFormulaCatId =
  | 'binary'
  | 'storage'
  | 'architecture'
  | 'logic'
  | 'networks';

export interface DigiTechFormulaCategory {
  id: DigiTechFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface DigiTechFormulaItem {
  id: string;
  cat: DigiTechFormulaCatId;
  name: string;
  topicId: string;
  summary: string;
  rearrangements: FormulaRearrangement[];
  variables: [string, string][];
  constants?: string[];
  trap: string;
  worked: {
    qHtml: string;
    stepsHtml: string[];
    ansHtml: string;
  };
  keywords: string[];
}

export const DIGITECH_FORMULA_CATEGORIES: DigiTechFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Digital Tech Formulas',
    shortLabel: 'All',
    desc: 'All 20 Digital Technologies formulas across Binary & Number Bases, Media & Storage Sizing, CPU Architecture, Logic Gates & Network Engineering',
  },
  {
    id: 'binary',
    label: 'Binary, Hex & Two’s Complement',
    shortLabel: 'Binary & Bases',
    desc: 'Positional base expansion, unsigned bit capacity 2ⁿ, Two’s Complement signed range, hexadecimal nibble mapping & bitwise shifts',
  },
  {
    id: 'storage',
    label: 'Storage Units, Images & Audio Sizing',
    shortLabel: 'Storage & Media',
    desc: 'Binary (KiB/MiB) vs decimal (kB/MB) units, uncompressed bitmap file size, PCM audio sizing & Nyquist sampling rate',
  },
  {
    id: 'architecture',
    label: 'CPU Clock, Address Bus & Complexity',
    shortLabel: 'CPU & Code',
    desc: 'Clock period T = 1/f, CPU execution time IC × CPI / f, address bus memory capacity 2ʷ & Binary Search log₂N comparisons',
  },
  {
    id: 'logic',
    label: 'Boolean Algebra, Gates & Adders',
    shortLabel: 'Logic Gates',
    desc: 'Truth-table row count 2ⁿ, De Morgan’s laws, XOR / NAND / NOR equations & Half-Adder Sum/Carry equations',
  },
  {
    id: 'networks',
    label: 'Bandwidth, Subnetting & Availability',
    shortLabel: 'Networks & SRE',
    desc: 'Network transfer time (Bytes × 8 / bps), IPv4 usable hosts 2ʰ − 2, full-mesh cable count n(n−1)/2 & MTBF system availability',
  },
];

export const DIGITECH_FORMULAS: DigiTechFormulaItem[] = [
  /* ─────────────── 1. BINARY, HEX & TWO'S COMPLEMENT (5) ─────────────── */
  {
    id: 'dtf-radix-val',
    cat: 'binary',
    name: 'Positional Number Base Expansion (Base r → Base 10)',
    topicId: 'dt-number-systems',
    summary: 'Converts any base-r numeral (binary, octal, or hexadecimal) to decimal by summing each digit multiplied by its positional power of r.',
    rearrangements: [
      { solveFor: 'dec', label: 'Integer Expansion', exprHtml: 'N<sub>10</sub> = d<sub>n−1</sub>r<sup>n−1</sup> + … + d<sub>1</sub>r<sup>1</sup> + d<sub>0</sub>r<sup>0</sup>' },
      { solveFor: 'frac', label: 'Fractional Bits', exprHtml: '0.d<sub>−1</sub>d<sub>−2</sub> = d<sub>−1</sub>r<sup>−1</sup> + d<sub>−2</sub>r<sup>−2</sup>' },
    ],
    variables: [
      ['r', 'Radix / base of the number system (2, 8, 10, or 16)'],
      ['d_k', 'Digit at position k (must satisfy 0 ≤ d_k ≤ r − 1)'],
      ['r⁰', 'Units place weight (= 1 for every valid base)'],
    ],
    constants: ['Hex digits: A=10, B=11, C=12, D=13, E=14, F=15'],
    trap: 'The rightmost integer digit always carries power r⁰ = 1, NOT r¹! Also verify every digit is strictly less than base r.',
    worked: {
      qHtml: 'Convert binary <strong>11010<sub>2</sub></strong> to decimal (base 10).',
      stepsHtml: [
        'Assign weights from right (2<sup>0</sup>) to left (2<sup>4</sup>): 16, 8, 4, 2, 1',
        'N<sub>10</sub> = 1(16) + 1(8) + 0(4) + 1(2) + 0(1) = 16 + 8 + 2 = 26',
      ],
      ansHtml: '26<sub>10</sub>',
    },
    keywords: ['binary to decimal', 'radix', 'positional weight', 'octal', 'hexadecimal'],
  },
  {
    id: 'dtf-unsigned-range',
    cat: 'binary',
    name: 'Unsigned n-Bit Patterns & Maximum Integer',
    topicId: 'dt-number-systems',
    summary: 'Determines the total number of distinct bit patterns and the largest non-negative integer representable in an n-bit register.',
    rearrangements: [
      { solveFor: 'patterns', label: 'Distinct Patterns', exprHtml: 'Patterns = 2<sup>n</sup>' },
      { solveFor: 'max', label: 'Max Unsigned Value', exprHtml: 'Max = 2<sup>n</sup> − 1 &nbsp;(Range: 0 to 2<sup>n</sup> − 1)' },
      { solveFor: 'bits', label: 'Minimum Bits Needed', exprHtml: 'n = ⌈log<sub>2</sub>(M)⌉ &nbsp;for M states' },
    ],
    variables: [
      ['n', 'Number of binary bits in the register or code word'],
      ['2ⁿ', 'Total unique combinations (including 0)'],
      ['2ⁿ − 1', 'Maximum unsigned integer (all n bits set to 1)'],
    ],
    constants: ['8 bits: 256 patterns (0–255) · 16 bits: 65,536 patterns (0–65,535)'],
    trap: 'Because 0 uses one pattern (000…0), the maximum unsigned integer in n bits is 2ⁿ − 1, NEVER 2ⁿ!',
    worked: {
      qHtml: 'What is the maximum unsigned integer stored in an <strong>8-bit</strong> register?',
      stepsHtml: [
        'Total patterns = 2<sup>8</sup> = 256',
        'Maximum unsigned integer = 2<sup>8</sup> − 1 = 256 − 1 = 255',
      ],
      ansHtml: '255',
    },
    keywords: ['unsigned range', 'bit patterns', '2^n - 1', '8-bit', 'register'],
  },
  {
    id: 'dtf-twos-comp',
    cat: 'binary',
    name: 'Two’s Complement Signed n-Bit Integer Range',
    topicId: 'dt-binary-arithmetic',
    summary: 'Gives the exact asymmetric negative-to-positive integer range and negation rule for standard n-bit Two’s Complement arithmetic.',
    rearrangements: [
      { solveFor: 'range', label: 'Signed Range', exprHtml: '−2<sup>n−1</sup> &nbsp;to&nbsp; +(2<sup>n−1</sup> − 1)' },
      { solveFor: 'negate', label: 'Two’s Complement Rule', exprHtml: '−X = (~X) + 1 &nbsp;(Invert all bits, then add 1)' },
    ],
    variables: [
      ['n', 'Word length in bits (MSB has negative weight −2ⁿ⁻¹)'],
      ['−2ⁿ⁻¹', 'Most negative representable integer (1 followed by n−1 zeros)'],
      ['+(2ⁿ⁻¹ − 1)', 'Most positive representable integer (0 followed by n−1 ones)'],
    ],
    constants: ['8-bit signed range: −128 to +127 (unique zero = 00000000₂)'],
    trap: 'Two’s complement has ONE zero (not two like one’s complement), giving one extra negative number: −128 to +127 in 8 bits, NOT −127 to +127!',
    worked: {
      qHtml: 'Find the 8-bit Two’s Complement representation of <strong>−18<sub>10</sub></strong>.',
      stepsHtml: [
        '+18 in 8-bit binary = 0001 0010<sub>2</sub>',
        'Invert bits (1’s complement) = 1110 1101<sub>2</sub>; add 1 ⇒ 1110 1110<sub>2</sub>',
      ],
      ansHtml: '11101110<sub>2</sub>',
    },
    keywords: ['twos complement', 'signed integer', '-128 to +127', 'ones complement', 'overflow'],
  },
  {
    id: 'dtf-hex-nibble',
    cat: 'binary',
    name: 'Hexadecimal–Binary Nibble Grouping & RGB Byte Law',
    topicId: 'dt-number-systems',
    summary: 'Maps each hexadecimal digit directly to 4 binary bits (1 nibble) and each 2-digit hex pair to 1 byte (00₁₆–FF₁₆).',
    rearrangements: [
      { solveFor: 'bits', label: 'Bit Equivalence', exprHtml: '1 Hex digit = 4 bits (1 nibble) &nbsp;·&nbsp; 2 Hex digits = 8 bits (1 byte)' },
      { solveFor: 'byte-val', label: '2-Digit Hex Value', exprHtml: '(H<sub>1</sub>H<sub>0</sub>)<sub>16</sub> = 16 × H<sub>1</sub> + H<sub>0</sub>' },
    ],
    variables: [
      ['H₁, H₀', 'High and low hexadecimal digits (0–9, A–F)'],
      ['Nibble', 'Group of 4 bits (values 0000₂ to 1111₂ = 0₁₆ to F₁₆)'],
    ],
    constants: ['24-bit True Color #RRGGBB = 6 hex digits = 3 bytes = 16,777,216 colors'],
    trap: 'Always pad binary groups from the RIGHT in sets of 4 bits (for Hex) or 3 bits (for Octal) — never group from the left!',
    worked: {
      qHtml: 'Convert hexadecimal color byte <strong>B4<sub>16</sub></strong> to decimal and binary.',
      stepsHtml: [
        'B = 11 (1011<sub>2</sub>) and 4 = 0100<sub>2</sub> ⇒ Binary = 10110100<sub>2</sub>',
        'Decimal = (11 × 16) + 4 = 176 + 4 = 180<sub>10</sub>',
      ],
      ansHtml: '180<sub>10</sub> (10110100<sub>2</sub>)',
    },
    keywords: ['hexadecimal', 'nibble', 'rgb hex', 'octal 3 bits', 'byte'],
  },
  {
    id: 'dtf-bit-shift',
    cat: 'binary',
    name: 'Logical & Arithmetic Bitwise Shift Scaling',
    topicId: 'dt-binary-arithmetic',
    summary: 'Relates k-bit left and right register shifts to fast integer multiplication and floor division by powers of 2.',
    rearrangements: [
      { solveFor: 'shl', label: 'Left Shift (<< k)', exprHtml: 'X &lt;&lt; k = X × 2<sup>k</sup>' },
      { solveFor: 'shr', label: 'Right Shift (>> k)', exprHtml: 'X &gt;&gt; k = ⌊X ÷ 2<sup>k</sup>⌋' },
    ],
    variables: [
      ['X', 'Integer operand stored in a CPU register'],
      ['k', 'Number of bit positions shifted'],
    ],
    trap: 'Shifting left by k bits multiplies by 2ᵏ (NOT by 2k!). Arithmetic right shift copies the sign bit (MSB) to preserve negative signs.',
    worked: {
      qHtml: 'An unsigned register holding <strong>13</strong> (00001101<sub>2</sub>) is shifted left by <strong>3 bits</strong>. Find the new value.',
      stepsHtml: [
        'X &lt;&lt; 3 = 13 × 2<sup>3</sup> = 13 × 8 = 104',
        'Binary check: 01101000<sub>2</sub> = 64 + 32 + 8 = 104',
      ],
      ansHtml: '104',
    },
    keywords: ['bitwise shift', 'left shift', 'right shift', 'multiply by 2^k'],
  },

  /* ─────────────── 2. STORAGE UNITS, IMAGES & AUDIO SIZING (4) ─────────────── */
  {
    id: 'dtf-storage-units',
    cat: 'storage',
    name: 'Binary (IEC 1024) vs Decimal (SI 1000) Storage Units',
    topicId: 'dt-memory-storage',
    summary: 'Converts accurately between bits, nibbles, bytes, binary powers (KiB, MiB, GiB = 2¹⁰, 2²⁰, 2³⁰) and SI decimal multiples (kB, MB, GB = 10³, 10⁶, 10⁹).',
    rearrangements: [
      { solveFor: 'bits-bytes', label: 'Bits & Bytes', exprHtml: '1 Byte (B) = 8 bits (b) = 2 nibbles' },
      { solveFor: 'iec', label: 'Binary IEC Scale', exprHtml: '1 KiB = 1,024 B (2<sup>10</sup>) &nbsp;·&nbsp; 1 MiB = 1,024 KiB (2<sup>20</sup>)' },
      { solveFor: 'si', label: 'Decimal SI Scale', exprHtml: '1 kB = 1,000 B (10<sup>3</sup>) &nbsp;·&nbsp; 1 MB = 1,000 kB (10<sup>6</sup>)' },
    ],
    variables: [
      ['b vs B', 'Lowercase b = bit; Uppercase B = Byte (8 bits)'],
      ['2¹⁰ = 1,024', 'Exact binary step factor between B → KiB → MiB → GiB → TiB'],
    ],
    trap: 'Never confuse lowercase Mb (megabits, used for network speed) with uppercase MB (megabytes, used for file size): 1 MB = 8 Mb!',
    worked: {
      qHtml: 'How many <strong>bits</strong> are in <strong>4 KiB</strong> of RAM?',
      stepsHtml: [
        'Bytes = 4 × 1,024 = 4,096 Bytes',
        'Bits = 4,096 × 8 = 32,768 bits',
      ],
      ansHtml: '32,768 bits',
    },
    keywords: ['byte', 'nibble', 'kibibyte', 'mebibyte', 'kilobyte', '1024'],
  },
  {
    id: 'dtf-image-size',
    cat: 'storage',
    name: 'Uncompressed Bitmap Image File Size & Color Depth',
    topicId: 'dt-data-encoding-media',
    summary: 'Computes raw raster image storage from pixel dimensions (W × H) and color bit depth b (where 2ᵇ = palette colors).',
    rearrangements: [
      { solveFor: 'bits', label: 'Size in Bits', exprHtml: 'Size<sub>bits</sub> = Width × Height × Color Depth (b)' },
      { solveFor: 'bytes', label: 'Size in Bytes', exprHtml: 'Size<sub>Bytes</sub> = (W × H × b) ÷ 8' },
      { solveFor: 'colors', label: 'Max Colors', exprHtml: 'Colors = 2<sup>b</sup>' },
    ],
    variables: [
      ['W, H', 'Horizontal width and vertical height in pixels'],
      ['b', 'Color depth in bits per pixel (bpp): e.g. 1-bit B/W, 8-bit 256 colors, 24-bit RGB'],
    ],
    trap: 'If the question gives the number of colors C (e.g. 256 colors), take b = log₂(C) = 8 bits FIRST — NEVER multiply W × H × 256!',
    worked: {
      qHtml: 'Calculate the uncompressed image payload (in kB, decimal) of an <strong>800 × 600</strong> bitmap with <strong>256 colors</strong>.',
      stepsHtml: [
        '256 colors = 2<sup>8</sup> ⇒ Color depth b = 8 bits per pixel (1 Byte/pixel)',
        'Bytes = (800 × 600 × 8) ÷ 8 = 480,000 B = 480 kB (or 468.75 KiB)',
      ],
      ansHtml: '480 kB (480,000 Bytes)',
    },
    keywords: ['bitmap size', 'color depth', 'resolution', 'pixels', '24-bit rgb'],
  },
  {
    id: 'dtf-audio-size',
    cat: 'storage',
    name: 'Uncompressed Digital Audio (PCM) File Size',
    topicId: 'dt-data-encoding-media',
    summary: 'Calculates raw pulse-code-modulated (WAV/PCM) audio storage from sample rate, bit depth, duration, and channel count.',
    rearrangements: [
      { solveFor: 'bits', label: 'Audio Bits', exprHtml: 'Size<sub>bits</sub> = f<sub>s</sub> × b × t × c' },
      { solveFor: 'bytes', label: 'Audio Bytes', exprHtml: 'Size<sub>Bytes</sub> = (f<sub>s</sub> × b × t × c) ÷ 8' },
      { solveFor: 'bitrate', label: 'Bit Rate', exprHtml: 'Bit Rate (bps) = f<sub>s</sub> × b × c' },
    ],
    variables: [
      ['f_s', 'Sampling rate in Hz (samples per second, e.g. 44,100 Hz)'],
      ['b', 'Sample resolution / bit depth in bits (e.g. 16-bit)'],
      ['t', 'Duration in seconds (convert minutes × 60!)'],
      ['c', 'Audio channels (Mono = 1, Stereo = 2)'],
    ],
    trap: 'Remember TWO conversions: multiply stereo recordings by c = 2 channels, convert minutes to seconds, and divide bits by 8 to get Bytes!',
    worked: {
      qHtml: 'Find the raw file size in Bytes of a <strong>10-second stereo</strong> clip sampled at <strong>20,000 Hz</strong> with <strong>16-bit</strong> resolution.',
      stepsHtml: [
        'Total bits = 20,000 × 16 × 10 × 2 = 6,400,000 bits',
        'Bytes = 6,400,000 ÷ 8 = 800,000 Bytes (800 kB)',
      ],
      ansHtml: '800,000 Bytes (800 kB)',
    },
    keywords: ['audio file size', 'sample rate', 'bit depth', 'stereo', 'pcm'],
  },
  {
    id: 'dtf-nyquist',
    cat: 'storage',
    name: 'Nyquist–Shannon Minimum Sampling Rate Theorem',
    topicId: 'dt-data-encoding-media',
    summary: 'States that a continuous analog signal with maximum frequency f_max must be sampled at least twice per cycle to prevent aliasing.',
    rearrangements: [
      { solveFor: 'fs', label: 'Minimum Sample Rate', exprHtml: 'f<sub>s(min)</sub> = 2 × f<sub>max</sub>' },
      { solveFor: 'fmax', label: 'Max Faithful Frequency', exprHtml: 'f<sub>max</sub> = f<sub>s</sub> ÷ 2' },
    ],
    variables: [
      ['f_s(min)', 'Minimum alias-free sampling frequency (Hz)'],
      ['f_max', 'Highest analog frequency component in the signal (Hz)'],
    ],
    constants: ['Human hearing ≤ 20 kHz ⇒ CD audio uses 44.1 kHz (> 2 × 20 kHz)'],
    trap: 'Sampling below 2 × f_max causes irreversible ALIASING (high frequencies fold into false low tones).',
    worked: {
      qHtml: 'Voice audio on a digital line contains frequencies up to <strong>4 kHz</strong>. What is the minimum Nyquist sampling rate?',
      stepsHtml: ['f<sub>s(min)</sub> = 2 × f<sub>max</sub> = 2 × 4 kHz = 8 kHz (8,000 samples/s)'],
      ansHtml: '8 kHz (8,000 Hz)',
    },
    keywords: ['nyquist', 'aliasing', 'sampling theorem', 'analog to digital'],
  },

  /* ─────────────── 3. CPU ARCHITECTURE & ALGORITHMIC COMPLEXITY (4) ─────────────── */
  {
    id: 'dtf-clock-period',
    cat: 'architecture',
    name: 'CPU Clock Frequency, Cycle Period & Execution Time',
    topicId: 'dt-cpu-fetch-execute',
    summary: 'Links microprocessor clock frequency f (Hz/GHz) to clock cycle duration T and total program CPU execution time.',
    rearrangements: [
      { solveFor: 'T', label: 'Clock Period', exprHtml: 'T = 1 ÷ f' },
      { solveFor: 'exec', label: 'CPU Execution Time', exprHtml: 't<sub>CPU</sub> = (IC × CPI) ÷ f = IC × CPI × T' },
      { solveFor: 'ips', label: 'Throughput (IPS)', exprHtml: 'IPS = f ÷ CPI' },
    ],
    variables: [
      ['f', 'Clock frequency in Hz (1 MHz = 10⁶ Hz, 1 GHz = 10⁹ Hz)'],
      ['T', 'Duration of 1 clock cycle in seconds (1 ns = 10⁻⁹ s)'],
      ['IC, CPI', 'Instruction Count and average Cycles Per Instruction'],
    ],
    constants: ['At f = 1 GHz, T = 1 ns · At f = 2 GHz, T = 0.5 ns · At f = 4 GHz, T = 0.25 ns'],
    trap: 'Higher GHz means SHORTER cycle period T! Always convert GHz to 10⁹ Hz before dividing.',
    worked: {
      qHtml: 'A <strong>2.5 GHz</strong> processor executes <strong>5 × 10<sup>9</sup></strong> instructions at an average <strong>CPI = 2</strong>. Find the execution time.',
      stepsHtml: [
        'Total clock cycles = IC × CPI = (5 × 10<sup>9</sup>) × 2 = 10 × 10<sup>9</sup> cycles',
        't<sub>CPU</sub> = (10 × 10<sup>9</sup>) ÷ (2.5 × 10<sup>9</sup> Hz) = 4 seconds',
      ],
      ansHtml: '4 s',
    },
    keywords: ['clock speed', 'ghz', 'nanosecond', 'cpi', 'execution time'],
  },
  {
    id: 'dtf-address-bus',
    cat: 'architecture',
    name: 'Address Bus Width & Maximum Addressable Memory',
    topicId: 'dt-cpu-fetch-execute',
    summary: 'Determines how many distinct memory locations (usually bytes) a CPU can directly address given an a-bit unidirectional address bus.',
    rearrangements: [
      { solveFor: 'locs', label: 'Addressable Locations', exprHtml: 'Locations = 2<sup>a</sup>' },
      { solveFor: 'cap', label: 'Total Addressable Memory', exprHtml: 'Memory = 2<sup>a</sup> × Word Size' },
    ],
    variables: [
      ['a', 'Width of the Address Bus in lines/bits'],
      ['Word Size', 'Size of each addressable cell (typically 1 Byte in byte-addressable RAM)'],
    ],
    constants: ['16-bit bus = 64 KiB · 20-bit bus = 1 MiB · 32-bit bus = 4 GiB · 64-bit bus = 16 EiB'],
    trap: 'The ADDRESS bus sets maximum RAM capacity (2ᵃ locations), whereas the DATA bus sets how many bits travel in one transfer!',
    worked: {
      qHtml: 'A byte-addressable microcontroller has a <strong>16-bit address bus</strong>. How many KiB of RAM can it directly address?',
      stepsHtml: [
        'Locations = 2<sup>16</sup> = 65,536 Bytes',
        'In KiB: 65,536 ÷ 1,024 = 64 KiB',
      ],
      ansHtml: '64 KiB',
    },
    keywords: ['address bus', 'addressable memory', '32-bit 4 gib', 'data bus'],
  },
  {
    id: 'dtf-binary-search',
    cat: 'architecture',
    name: 'Binary Search vs Linear Search Worst-Case Comparisons',
    topicId: 'dt-data-structures-arrays',
    summary: 'Contrasts O(log₂ N) halving comparisons on a sorted array against O(N) sequential comparisons on an unsorted list.',
    rearrangements: [
      { solveFor: 'bin', label: 'Binary Search Max Steps', exprHtml: 'C<sub>max</sub> = ⌊log<sub>2</sub>(N)⌋ + 1' },
      { solveFor: 'lin', label: 'Linear Search Max Steps', exprHtml: 'C<sub>max</sub> = N &nbsp;(Average ≈ N ÷ 2)' },
    ],
    variables: [
      ['N', 'Number of elements in the list/array'],
      ['C_max', 'Worst-case element comparisons when item is absent or last found'],
    ],
    trap: 'Binary search ONLY works when the array is ALREADY SORTED! On an unsorted list you must use Linear Search or sort first.',
    worked: {
      qHtml: 'At most how many comparisons does <strong>Binary Search</strong> require on a sorted list of <strong>1,000</strong> student IDs?',
      stepsHtml: [
        'Since 2<sup>9</sup> = 512 and 2<sup>10</sup> = 1,024, ⌊log<sub>2</sub>(1000)⌋ = 9',
        'C<sub>max</sub> = 9 + 1 = 10 comparisons (versus 1,000 for Linear Search!)',
      ],
      ansHtml: '10 comparisons',
    },
    keywords: ['binary search', 'linear search', 'log2 n', 'big-o', 'sorted array'],
  },

  /* ─────────────── 4. BOOLEAN ALGEBRA, GATES & ADDERS (4) ─────────────── */
  {
    id: 'dtf-truth-rows',
    cat: 'logic',
    name: 'Truth-Table Row Count & Boolean Basic Identities',
    topicId: 'dt-boolean-logic-gates',
    summary: 'Determines truth-table size for n Boolean inputs and simplifies logic circuits via Absorption, Idempotent, and Complement laws.',
    rearrangements: [
      { solveFor: 'rows', label: 'Truth-Table Rows', exprHtml: 'Rows = 2<sup>n</sup> &nbsp;(for n input variables)' },
      { solveFor: 'ident', label: 'Core Identities', exprHtml: 'A + Ā = 1 &nbsp;·&nbsp; A · Ā = 0 &nbsp;·&nbsp; A + A·B = A' },
    ],
    variables: [
      ['n', 'Number of distinct Boolean input variables (A, B, C, …)'],
      ['+, ·, Ā', 'Logical OR (+), Logical AND (·), Logical NOT (overbar / ~)'],
    ],
    trap: 'In Boolean algebra, 1 + 1 = 1 (logical OR, NOT binary arithmetic 10₂!). Absorption A + A·B simplifies directly to A.',
    worked: {
      qHtml: 'Simplify the Boolean expression <strong>Y = A·B + A·B̄</strong> and find how many rows a <strong>4-input</strong> truth table has.',
      stepsHtml: [
        'Factor A: Y = A · (B + B̄) = A · 1 = A',
        'For n = 4 inputs: Rows = 2<sup>4</sup> = 16 rows',
      ],
      ansHtml: 'Y = A · 16 rows',
    },
    keywords: ['truth table rows', 'boolean identities', 'absorption law', 'complement'],
  },
  {
    id: 'dtf-demorgan',
    cat: 'logic',
    name: 'De Morgan’s Theorems & Universal NAND / NOR Gates',
    topicId: 'dt-boolean-logic-gates',
    summary: 'Transforms negated AND/OR gates by breaking the bar and flipping the operator between AND (·) and OR (+).',
    rearrangements: [
      { solveFor: 'nand', label: 'NAND De Morgan', exprHtml: '¬(A · B) = ¬A + ¬B' },
      { solveFor: 'nor', label: 'NOR De Morgan', exprHtml: '¬(A + B) = ¬A · ¬B' },
      { solveFor: 'inv', label: 'NAND/NOR Inverter', exprHtml: '¬A = ¬(A · A) = ¬(A + A)' },
    ],
    variables: [
      ['¬(A · B)', 'NAND output (0 ONLY when A=1 and B=1)'],
      ['¬(A + B)', 'NOR output (1 ONLY when A=0 and B=0)'],
    ],
    trap: 'Break the line, change the sign! ¬(A + B) equals ¬A · ¬B, NEVER ¬A + ¬B!',
    worked: {
      qHtml: 'Evaluate <strong>NAND(1, 1)</strong> and simplify <strong>¬(¬X + Y)</strong>.',
      stepsHtml: [
        'NAND(1, 1) = ¬(1 · 1) = ¬1 = 0',
        'By De Morgan: ¬(¬X + Y) = ¬(¬X) · ¬Y = X · ¬Y',
      ],
      ansHtml: '0 and X · ¬Y',
    },
    keywords: ['de morgan', 'nand gate', 'nor gate', 'universal gate'],
  },
  {
    id: 'dtf-xor-gate',
    cat: 'logic',
    name: 'Exclusive-OR (XOR ⊕) & Exclusive-NOR (XNOR) Equations',
    topicId: 'dt-boolean-logic-gates',
    summary: 'Models inequality detection (XOR = 1 when inputs differ) and bit-equality comparison (XNOR = 1 when inputs match).',
    rearrangements: [
      { solveFor: 'xor', label: 'XOR Equation', exprHtml: 'A ⊕ B = A·¬B + ¬A·B' },
      { solveFor: 'xnor', label: 'XNOR Equivalence', exprHtml: '¬(A ⊕ B) = A·B + ¬A·¬B' },
    ],
    variables: [
      ['A ⊕ B', 'Exclusive-OR output (1 when A ≠ B; 0 when A = B)'],
      ['¬(A ⊕ B)', 'Exclusive-NOR / Equivalence output (1 when A = B)'],
    ],
    constants: ['Self-inverse property (used in stream ciphers & parity): (M ⊕ K) ⊕ K = M'],
    trap: 'Unlike inclusive OR (where 1 + 1 = 1), Exclusive-OR outputs 0 when BOTH inputs are 1 (1 ⊕ 1 = 0)!',
    worked: {
      qHtml: 'Compute the bitwise XOR of <strong>1010<sub>2</sub> ⊕ 1100<sub>2</sub></strong>.',
      stepsHtml: [
        'Compare bit by bit (different = 1, same = 0): (1⊕1)(0⊕1)(1⊕0)(0⊕0)',
        'Result = 0110<sub>2</sub>',
      ],
      ansHtml: '0110<sub>2</sub>',
    },
    keywords: ['xor', 'xnor', 'exclusive or', 'parity', 'cipher'],
  },
  {
    id: 'dtf-half-adder',
    cat: 'logic',
    name: 'Binary Half-Adder & Full-Adder Logic Equations',
    topicId: 'dt-boolean-logic-gates',
    summary: 'Combines an XOR gate for the Sum bit and an AND gate for the Carry bit to perform hardware binary addition inside the ALU.',
    rearrangements: [
      { solveFor: 'ha', label: 'Half-Adder (A, B)', exprHtml: 'Sum S = A ⊕ B &nbsp;·&nbsp; Carry C = A · B' },
      { solveFor: 'fa', label: 'Full-Adder (A, B, C_in)', exprHtml: 'S = A ⊕ B ⊕ C<sub>in</sub> &nbsp;·&nbsp; C<sub>out</sub> = A·B + C<sub>in</sub>·(A ⊕ B)' },
    ],
    variables: [
      ['A, B', '1-bit binary operands being added'],
      ['C_in, C_out', 'Carry-in from previous bit and Carry-out to next higher bit'],
    ],
    trap: 'A Half-Adder has NO Carry-In input, so it can only add the least significant bit (LSB); chaining multi-bit ALU addition requires Full-Adders!',
    worked: {
      qHtml: 'Find Sum <strong>S</strong> and Carry-out <strong>C<sub>out</sub></strong> for a Full-Adder when <strong>A = 1, B = 1, C<sub>in</sub> = 1</strong>.',
      stepsHtml: [
        '1 + 1 + 1 in binary = 3<sub>10</sub> = 11<sub>2</sub>',
        'S = 1 ⊕ 1 ⊕ 1 = 1; C<sub>out</sub> = (1·1) + 1·(0) = 1',
      ],
      ansHtml: 'S = 1, C<sub>out</sub> = 1',
    },
    keywords: ['half adder', 'full adder', 'sum and carry', 'alu circuit'],
  },

  /* ─────────────── 5. NETWORKS, SUBNETTING & RELIABILITY (4) ─────────────── */
  {
    id: 'dtf-transfer-time',
    cat: 'networks',
    name: 'Network File Transfer Time & Throughput Equation',
    topicId: 'dt-network-topologies-media',
    summary: 'Calculates exact download/upload transmission time by converting file Bytes into bits before dividing by link bandwidth in bits/second.',
    rearrangements: [
      { solveFor: 'time', label: 'Transfer Time (s)', exprHtml: 't = (File Size in Bytes × 8) ÷ Bandwidth (bps)' },
      { solveFor: 'bw', label: 'Required Bandwidth', exprHtml: 'Bandwidth (bps) = (Bytes × 8) ÷ t' },
    ],
    variables: [
      ['File Size', 'Payload size in Bytes (convert MB × 8 to get Megabits!)'],
      ['Bandwidth', 'Channel bit rate in bits per second (Mbps = 10⁶ bps)'],
      ['t', 'Ideal transmission time in seconds'],
    ],
    trap: 'The #1 networking trap: File sizes are in MegaBYTES (MB) while speeds are in MegaBITS per second (Mbps) — ALWAYS multiply MB by 8 first!',
    worked: {
      qHtml: 'How long does it take to download a <strong>150 MB</strong> update over a steady <strong>40 Mbps</strong> fiber link (decimal SI)?',
      stepsHtml: [
        'Convert 150 MB to Megabits: 150 × 8 = 1,200 Mb',
        't = 1,200 Mb ÷ 40 Mbps = 30 seconds',
      ],
      ansHtml: '30 s',
    },
    keywords: ['transfer time', 'bandwidth', 'throughput', 'mbps vs mb', 'download time'],
  },
  {
    id: 'dtf-ipv4-subnet',
    cat: 'networks',
    name: 'IPv4 CIDR Prefix & Usable Host Addresses per Subnet',
    topicId: 'dt-ip-addressing-dns',
    summary: 'Computes host bit count h = 32 − prefix and subtracts the reserved Network ID and Broadcast address to find assignable IPv4 hosts.',
    rearrangements: [
      { solveFor: 'hosts', label: 'Usable Host IPs', exprHtml: 'Usable Hosts = 2<sup>h</sup> − 2 &nbsp;where&nbsp; h = 32 − Prefix' },
      { solveFor: 'subnets', label: 'Subnets Created', exprHtml: 'Subnets = 2<sup>s</sup> &nbsp;(s = borrowed subnet bits)' },
    ],
    variables: [
      ['Prefix (/p)', 'CIDR network prefix length (e.g. /24 → subnet mask 255.255.255.0)'],
      ['h', 'Remaining host bits in the 32-bit IPv4 address (h = 32 − p)'],
      ['−2', 'Excludes Network address (all host bits 0) and Broadcast address (all host bits 1)'],
    ],
    constants: ['/24 → 254 hosts · /25 → 126 hosts · /26 → 62 hosts · /30 → 2 point-to-point hosts'],
    trap: 'Always subtract 2 from 2ʰ! A /24 network has 2⁸ = 256 total IP addresses, of which ONLY 254 are assignable to devices.',
    worked: {
      qHtml: 'How many usable host IP addresses exist in the subnet <strong>192.168.10.0/26</strong>?',
      stepsHtml: [
        'Host bits h = 32 − 26 = 6 bits',
        'Usable hosts = 2<sup>6</sup> − 2 = 64 − 2 = 62 hosts',
      ],
      ansHtml: '62 usable hosts',
    },
    keywords: ['ipv4', 'cidr', 'subnet mask', 'usable hosts', '2^h - 2'],
  },
  {
    id: 'dtf-mesh-links',
    cat: 'networks',
    name: 'Full-Mesh Topology Dedicated Link Count',
    topicId: 'dt-network-topologies-media',
    summary: 'Gives the exact number of bidirectional point-to-point physical links needed to interconnect every pair among n nodes in a full mesh.',
    rearrangements: [
      { solveFor: 'links', label: 'Full-Mesh Cables', exprHtml: 'Links L = n(n − 1) ÷ 2' },
      { solveFor: 'ports', label: 'I/O Ports per Node', exprHtml: 'Ports per node = n − 1' },
    ],
    variables: [
      ['n', 'Total number of routers or nodes in the full-mesh topology'],
      ['L', 'Total bidirectional point-to-point physical links'],
    ],
    trap: 'Divide n(n − 1) by 2 for standard full-duplex bidirectional cables — otherwise every link between A and B is counted twice!',
    worked: {
      qHtml: 'A core banking WAN connects <strong>8 branch routers</strong> in a full-mesh topology. How many physical links are required?',
      stepsHtml: ['L = n(n − 1) ÷ 2 = (8 × 7) ÷ 2 = 56 ÷ 2 = 28 links'],
      ansHtml: '28 links',
    },
    keywords: ['mesh topology', 'links formula', 'n(n-1)/2', 'network cables'],
  },
  {
    id: 'dtf-availability',
    cat: 'networks',
    name: 'System Availability, MTBF & MTTR Reliability Law',
    topicId: 'dt-system-reliability-fault',
    summary: 'Quantifies server/cloud uptime percentage from Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR).',
    rearrangements: [
      { solveFor: 'avail', label: 'Availability (%)', exprHtml: 'Availability = [MTBF ÷ (MTBF + MTTR)] × 100%' },
      { solveFor: 'uptime', label: 'Observed Uptime %', exprHtml: 'Availability = [(Total Time − Downtime) ÷ Total Time] × 100%' },
    ],
    variables: [
      ['MTBF', 'Mean Time Between Failures (average operational uptime per cycle)'],
      ['MTTR', 'Mean Time To Repair / Recover (average outage duration)'],
    ],
    constants: ['99.9% ("Three Nines") ≈ 8.76 hrs/yr downtime · 99.999% ("Five Nines") ≈ 5.26 min/yr'],
    trap: 'The denominator is (MTBF + MTTR) — total cycle time — NOT MTBF alone! Ensure MTBF and MTTR use the same time unit (hours).',
    worked: {
      qHtml: 'A cloud gateway has <strong>MTBF = 995 hours</strong> and <strong>MTTR = 5 hours</strong>. Calculate its availability.',
      stepsHtml: [
        'Total cycle = MTBF + MTTR = 995 + 5 = 1,000 hours',
        'Availability = (995 ÷ 1,000) × 100% = 99.5%',
      ],
      ansHtml: '99.5%',
    },
    keywords: ['availability', 'mtbf', 'mttr', 'uptime', 'fault tolerance'],
  },
];
