import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaPython } from 'react-icons/fa';

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
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
      title: 'Social Media Platform (Velo)',
      description: 'Designed and developed a full-stack social media platform featuring real-time messaging, authentication, and content sharing. Leveraged Redis for caching, reducing server response times by 25%.',
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js(Socket Server)', 'MongoDB', 'Redis'],
      github: 'velo',
      demo: 'https://velo-virid.vercel.app'
    },
    {
      title: 'Video Conferencing App (FaceY)',
      description: 'Built a robust video conferencing app with features such as real-time video, chat, and session management',
      tech: ['React', 'Next.js', 'MongoDB', 'Tailwind CSS', 'Golang(Socket Server)'],
      github: 'facey',
      demo: 'https://facey.vercel.app'
    },
    {
      title: 'Online Pet Store (Petty Shelter)',
      description: 'Developed a comprehensive e-commerce platform for pet-related products and services. Integrated payment gateways and role-based access controls, ensuring secure transactions.',
      tech: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      github: 'pet-shelter',
      demo: 'https://petty-store..vercel.app'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* About Section */}
      <section id="about" className="mb-20 scroll-mt-20">
        <h2 className="text-3xl text-center font-bold mb-6 text-gray-800 dark:text-white">About Me</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              I&apos;m a full-stack developer with 3 years of experience building web applications.
              I specialize in modern JavaScript frameworks and have a passion for creating
              efficient, scalable, and user-friendly solutions.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              When I&apos;m not coding, you can find me contributing to open-source projects,
              learning new technologies, or mentoring junior developers.
            </p>
            <div className="flex gap-4 mb-4">
              <FaReact className="text-4xl text-blue-500" />
              <FaNodeJs className="text-4xl text-green-500" />
              <svg viewBox="0 -14.75 254.5 254.5" height={"2.5em"} width={"2.5em"} xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>file_type_go</title><path d="M-46.926,89c-.621,0-.777-.311-.466-.777l3.262-4.194a2.225,2.225,0,0,1,1.708-.777H13.026c.621,0,.777.466.466.932l-2.64,4.038a2.367,2.367,0,0,1-1.553.932Z" style={{fill:"#00acd7"}}></path><path d="M-70.379,103.285c-.621,0-.777-.311-.466-.777l3.262-4.194a2.225,2.225,0,0,1,1.708-.777H4.95a.714.714,0,0,1,.777.932L4.484,102.2a1.358,1.358,0,0,1-1.4.932Z" style={{fill:"#00acd7"}}></path><path d="M-32.792,117.574c-.621,0-.777-.466-.466-.932l2.174-3.883a2.06,2.06,0,0,1,1.553-.932H1.533c.621,0,.932.466.932,1.087l-.311,3.728a1.167,1.167,0,0,1-1.087,1.087Z" style={{fill:"#00acd7"}}></path><path d="M128.426,86.2c-9.785,2.485-16.464,4.349-26.093,6.834-2.33.621-2.485.777-4.5-1.553-2.33-2.64-4.038-4.349-7.3-5.9-9.785-4.815-19.259-3.417-28.112,2.33-10.561,6.834-16,16.929-15.842,29.51.155,12.425,8.7,22.676,20.968,24.385,10.561,1.4,19.414-2.33,26.4-10.251,1.4-1.708,2.64-3.572,4.194-5.747H68.163c-3.262,0-4.038-2.019-2.951-4.659,2.019-4.815,5.747-12.891,7.921-16.929a4.194,4.194,0,0,1,3.883-2.485h56.535c-.311,4.194-.311,8.387-.932,12.581a66.239,66.239,0,0,1-12.736,30.442C108.7,159.51,94.1,168.673,75.618,171.158c-15.221,2.019-29.355-.932-41.78-10.251a48.785,48.785,0,0,1-19.725-34.48c-2.019-16.929,2.951-32.15,13.2-45.508C38.342,66.475,52.942,57.312,70.8,54.05c14.6-2.64,28.578-.932,41.159,7.61a48.686,48.686,0,0,1,18.017,21.9C130.911,84.958,130.289,85.735,128.426,86.2Z" style={{fill:"#00acd7"}}></path><path d="M179.835,172.09c-14.134-.311-27.025-4.349-37.9-13.668a48.711,48.711,0,0,1-16.774-29.976c-2.8-17.551,2.019-33.082,12.581-46.905,11.338-14.91,25.006-22.676,43.488-25.938,15.842-2.8,30.753-1.243,44.265,7.921,12.27,8.387,19.88,19.725,21.9,34.635,2.64,20.968-3.417,38.052-17.861,52.652a71.17,71.17,0,0,1-37.276,19.88C188.067,171.469,183.874,171.624,179.835,172.09ZM216.8,109.343a44.7,44.7,0,0,0-.466-5.125c-2.8-15.376-16.929-24.074-31.684-20.657-14.444,3.262-23.763,12.425-27.18,27.025a25.579,25.579,0,0,0,14.289,29.355c8.542,3.728,17.085,3.262,25.317-.932C209.345,132.64,216.024,122.7,216.8,109.343Z" style={{fill:"#00acd7"}}></path></g></svg>
              <FaPython className="text-4xl text-yellow-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <h2 className="text-3xl text-center font-bold mb-8 text-gray-800 dark:text-white">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
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
          ))}
        </div>
      </section>
    </div>
  );
}