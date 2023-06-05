export interface MdsvexFile {
  default: import('svelte/internal').SvelteComponent
  metadata: Record<string, string>
}

export type MdsvexResolver = () => Promise<MdsvexFile>
