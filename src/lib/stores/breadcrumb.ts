import { writable } from 'svelte/store';

export type Breadcrumb = {
    name: string;
    path: string;
};

export const breadcrumbStore = writable<Breadcrumb[]>([]);
