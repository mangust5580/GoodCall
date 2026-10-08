export type LaptopCpuFamily =
  | 'apple-m3'
  | 'intel-core-i5'
  | 'intel-core-i7'
  | 'intel-core-ultra-5'
  | 'amd-ryzen-5'
  | 'amd-ryzen-7';

export type LaptopGpu = 'integrated' | 'rtx-3050' | 'rtx-4050' | 'rtx-4060';

export type LaptopOs = 'macos' | 'windows-11';

export interface LaptopFacts {
  readonly diagonal: number;
  readonly cpu: LaptopCpuFamily;
  readonly cpuModel: string;
  readonly ram: number;
  readonly ssd: number;
  readonly gpu: LaptopGpu;
  readonly os: LaptopOs;
  readonly colour: string;
}

export const LAPTOP_CPU_LABELS: Readonly<Record<LaptopCpuFamily, string>> = {
  'apple-m3': 'Apple M3',
  'intel-core-i5': 'Intel Core i5',
  'intel-core-i7': 'Intel Core i7',
  'intel-core-ultra-5': 'Intel Core Ultra 5',
  'amd-ryzen-5': 'AMD Ryzen 5',
  'amd-ryzen-7': 'AMD Ryzen 7',
};

export const LAPTOP_GPU_LABELS: Readonly<Record<LaptopGpu, string>> = {
  integrated: 'Встроенная',
  'rtx-3050': 'NVIDIA GeForce RTX 3050',
  'rtx-4050': 'NVIDIA GeForce RTX 4050',
  'rtx-4060': 'NVIDIA GeForce RTX 4060',
};

export const LAPTOP_OS_LABELS: Readonly<Record<LaptopOs, string>> = {
  macos: 'macOS',
  'windows-11': 'Windows 11',
};

const LAPTOP_FACTS_BY_SLUG: Readonly<Record<string, LaptopFacts>> = {
  'macbook-air-13-m3-256': {
    diagonal: 13.6,
    cpu: 'apple-m3',
    cpuModel: 'Apple M3',
    ram: 8,
    ssd: 256,
    gpu: 'integrated',
    os: 'macos',
    colour: 'Полночь',
  },
  'macbook-pro-14-m3-512': {
    diagonal: 14.2,
    cpu: 'apple-m3',
    cpuModel: 'Apple M3',
    ram: 8,
    ssd: 512,
    gpu: 'integrated',
    os: 'macos',
    colour: 'Серый космос',
  },
  'asus-vivobook-15-i5-512': {
    diagonal: 15.6,
    cpu: 'intel-core-i5',
    cpuModel: 'Intel Core i5-1335U',
    ram: 16,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серебристый',
  },
  'asus-tuf-f15-rtx3050': {
    diagonal: 15.6,
    cpu: 'intel-core-i5',
    cpuModel: 'Intel Core i5-12500H',
    ram: 16,
    ssd: 512,
    gpu: 'rtx-3050',
    os: 'windows-11',
    colour: 'Серый',
  },
  'lenovo-ideapad-slim-5-14': {
    diagonal: 14,
    cpu: 'amd-ryzen-7',
    cpuModel: 'AMD Ryzen 7 7730U',
    ram: 16,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серый',
  },
  'lenovo-legion-5-16-rtx4060': {
    diagonal: 16,
    cpu: 'amd-ryzen-7',
    cpuModel: 'AMD Ryzen 7 7840HS',
    ram: 16,
    ssd: 1024,
    gpu: 'rtx-4060',
    os: 'windows-11',
    colour: 'Серый',
  },
  'hp-15-i5-512': {
    diagonal: 15.6,
    cpu: 'intel-core-i5',
    cpuModel: 'Intel Core i5-1335U',
    ram: 8,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серебристый',
  },
  'hp-victus-16-rtx4050': {
    diagonal: 16.1,
    cpu: 'amd-ryzen-5',
    cpuModel: 'AMD Ryzen 5 7640HS',
    ram: 16,
    ssd: 512,
    gpu: 'rtx-4050',
    os: 'windows-11',
    colour: 'Синий',
  },
  'acer-aspire-5-i5-512': {
    diagonal: 15.6,
    cpu: 'intel-core-i5',
    cpuModel: 'Intel Core i5-1335U',
    ram: 16,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серый',
  },
  'acer-swift-go-14-ultra5': {
    diagonal: 14,
    cpu: 'intel-core-ultra-5',
    cpuModel: 'Intel Core Ultra 5 125H',
    ram: 16,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серебристый',
  },
  'msi-katana-17-rtx4060': {
    diagonal: 17.3,
    cpu: 'intel-core-i7',
    cpuModel: 'Intel Core i7-13620H',
    ram: 16,
    ssd: 1024,
    gpu: 'rtx-4060',
    os: 'windows-11',
    colour: 'Чёрный',
  },
  'huawei-matebook-d16-i5': {
    diagonal: 16,
    cpu: 'intel-core-i5',
    cpuModel: 'Intel Core i5-13420H',
    ram: 16,
    ssd: 512,
    gpu: 'integrated',
    os: 'windows-11',
    colour: 'Серый космос',
  },
};

export const LAPTOP_FACT_SLUGS: readonly string[] = Object.keys(LAPTOP_FACTS_BY_SLUG);

export function laptopFacts(slug: string): LaptopFacts | undefined {
  return Object.hasOwn(LAPTOP_FACTS_BY_SLUG, slug) ? LAPTOP_FACTS_BY_SLUG[slug] : undefined;
}

export function formatLaptopDiagonal(diagonal: number): string {
  return `${String(diagonal).replace('.', ',')}″`;
}

export function formatLaptopMemory(gigabytes: number): string {
  return gigabytes >= 1024 && gigabytes % 1024 === 0
    ? `${String(gigabytes / 1024)} ТБ`
    : `${String(gigabytes)} ГБ`;
}
