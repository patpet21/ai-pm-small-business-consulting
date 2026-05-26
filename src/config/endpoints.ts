type ViteImportMeta = ImportMeta & {
  env?: {
    VITE_REAL_ESTATE_AI_PM_ENDPOINT?: string;
  };
};

const importMeta = import.meta as ViteImportMeta;

export const REAL_ESTATE_AI_PM_ENDPOINT =
  importMeta.env?.VITE_REAL_ESTATE_AI_PM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';
