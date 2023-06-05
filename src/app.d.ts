// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      sidebar?: SidebarItem[]
    }
    // interface Platform {}
  }
}

type SidebarItem = { title: string; href: string; children?: SidebarItem[] }

export { SidebarItem }
