/* eslint-disable @next/next/no-img-element */
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, BookOpen, Code2 } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  img?: string;
}

// [
//     { delay: 0.0, filter: '2', description: "HTML, CSS and JS", img: '/security.png', title: 'Lock Screen Page', link: 'https://ojutalayomi.github.io/security' },
//     { delay: 0.2, filter: '1', description: "Next.JS, TailwindCSS, Redis, Express JS and MongoDB", img: '/velo-virid.vercel.png', title: 'Velo', link: 'https://velo-virid.vercel.app' },
//     { delay: 0.4, filter: '2', description: "HTML, CSS and JS", img: '/noow.png', title: 'Sign-In/Sign-Up Page', link: 'https://ojutalayomi.github.io/Newsletter-sign-up' },
//     { delay: 0.6, filter: '2', description: "HTML, SCSS and JS", img: '/analytics-dashboard-362w.onrender.com_.png', title: 'Analytics Dashboard', link: 'https://analytics-dashboard-362w.onrender.com/' },
//     { delay: 0.8, filter: '2', description: "HTML, CSS and JS", img: '/ojutalayomi.github.io_Login_.png', title: 'Wuramide Cakes', link: 'https://ojutalayomi.github.io/Login' },
//     { delay: 1.0, filter: '2', description: "HTML, SCSS and JS", img: '/natoplus.png', title: 'NatoPlus', link: 'https://ojutalayomi.github.io/natoplus' },
//     { delay: 1.2, filter: '1', description: "Next.JS, TailwindCSS, ShadCN, Golang, Redis and MongoDB", img: '/facey.vercel.app.png', title: 'Facey', link: 'https://facey.vercel.app' },
//     { delay: 1.4, filter: '1', description: "HTML, CSS, JS and Express JS", img: '/portfolio.page.png', title: 'My Portfolio', link: 'https://portfolio-enb2.onrender.com' }
// ]



export default function MainSections() {
  const projects: Project[] = [
    {
      title: 'Analytics Dashboard',
      description: 'Developed a comprehensive analytics dashboard for tracking website traffic, user engagement, and performance metrics. Implemented real-time data visualization and customizable dashboards.',
      tech: ['HTML', 'CSS', 'SCSS', 'JS'],
      github: 'analytics-dashboard',
      demo: 'https://analytics-dashboard-362w.onrender.com/',
      img: '/analytics-dashboard-362w.onrender.com_.png'
    },
    {
      title: 'Social Media Platform (Velo)',
      description: 'Designed and developed a full-stack social media platform featuring real-time messaging, authentication, and content sharing. Leveraged Redis for caching, reducing server response times by 25%.',
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js(Socket Server)', 'MongoDB', 'Redis'],
      github: 'velo',
      demo: 'https://velo-virid.vercel.app',
      img: '/velo-virid.vercel.png'
    },
    {
      title: 'Video Conferencing App (FaceY)',
      description: 'Built a robust video conferencing app with features such as real-time video, chat, and session management',
      tech: ['React', 'Next.js', 'MongoDB', 'Tailwind CSS', 'Golang(Socket Server)'],
      github: 'facey',
      demo: 'https://facey.vercel.app',
      img: '/facey.vercel.app.png'
    },
    {
      title: 'Online Pet Store (Petty Shelter)',
      description: 'Developed a comprehensive e-commerce platform for pet-related products and services. Integrated payment gateways and role-based access controls, ensuring secure transactions.',
      tech: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      github: 'pet-shelter',
      demo: 'https://petty-store.vercel.app',
      img: '/petty-store.vercel.app(1).png'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* About Section */}
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Cpu className="h-6 w-6" />
        About Me
      </h2>
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-6">
          <p className="text-lg mb-4">
            I am a passionate Computer Science undergraduate at the University of Lagos, building expertise in full-stack web development. Since starting my coding journey in November 2023, I&apos;ve dedicated myself to mastering modern web technologies and creating efficient, scalable applications.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Currently Learning & Growing</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            With a strong foundation in data structures, algorithms, and cloud computing, I&apos;m constantly pushing my boundaries to become a well-rounded software engineer. When not coding, I contribute to open-source projects and mentor junior developers.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5" />
            <span className="font-medium">My Stack</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            On the front end, I create intuitive and responsive user interfaces using React, Next.js, TailwindCSS, HTML5, and JavaScript, ensuring smooth user experiences. On the back end, I develop high-performance APIs and real-time systems with Node.js, Express.js, and Golang, leveraging MongoDB, Redis, and SQLite for database management.
            I am proficient in JavaScript, TypeScript, Python, and Golang, and I thrive in an environment where I can design, build, and optimize software solutions. I also work with Docker, Git, Firebase, AWS, and Vercel to deploy and manage applications efficiently.
          </p>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <h2 className="text-3xl text-center font-bold my-8 text-gray-800 dark:text-white">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="flex flex-col items-center border dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={project.img} alt={project.title} className="w-full h-auto object-cover rounded-t-xl mb-4" />
              <div
                className="relative p-6"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={"https://github.com/ojutalayomi/"+project.github}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub className="mr-2" /> Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}