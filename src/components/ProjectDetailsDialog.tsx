import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageOff } from "lucide-react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";

export function ProjectDetailsDialog({ project, onView }: { project: Project; onView?: () => void }) {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) onView?.();
      }}>
        <DialogTrigger asChild>
          <div className="cursor-pointer group">
            <div className="flex flex-col items-center border dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Avatar className="w-full h-auto object-cover rounded-none !rounded-t-xl aspect-[16/10] group-hover:opacity-90 transition-opacity">
                <AvatarImage src={project.image || "/i.png"} alt={project.imageAlt} className="w-full h-auto object-cover rounded-t-xl" />
                <AvatarFallback className="w-full h-auto object-cover rounded-none rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <ImageOff className="w-12 h-12" />
                  <span className="sr-only">{project.imageAlt}</span>
                </AvatarFallback>
              </Avatar>
              <div className="p-4 w-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Project Image */}
            <div className="relative">
              <Avatar className="w-full h-auto object-cover rounded-lg aspect-video">
                <AvatarImage src={project.image || "/i.png"} alt={project.imageAlt} className="w-full h-auto object-cover rounded-lg" />
                <AvatarFallback className="w-full h-auto object-cover rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 aspect-video">
                  <ImageOff className="w-16 h-16" />
                  <span className="sr-only">{project.imageAlt}</span>
                </AvatarFallback>
              </Avatar>
            </div>
  
            {/* Project Description */}
            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Description</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
  
            {/* Tech Stack */}
            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
  
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Project Details</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <span className="font-medium">Date Added:</span> {new Date(project.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div>
                    <span className="font-medium">Image Alt:</span> {project.imageAlt}
                  </div>
                </div>
              </div>
  
              {/* Links */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Links</h4>
                <div className="space-y-2">
                  <a 
                    href={project.githubRepo.includes("https://github.com/") ? project.githubRepo : "https://github.com/ojutalayomi/"+project.githubRepo} 
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <FaGithub className="mr-2" /> View Source Code
                  </a>
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}