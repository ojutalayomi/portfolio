
export interface Project {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  githubRepo: string;
  demoUrl?: string;
  image?: string;
  imageAlt: string;
  dateAdded: string;
}
