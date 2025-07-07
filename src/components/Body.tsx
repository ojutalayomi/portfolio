/* eslint-disable @next/next/no-img-element */
import { sql } from '@vercel/postgres';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, CardContent } from './ui/card';
import { Cpu, BookOpen, Code2, Smartphone, CheckCircle, Copy, EyeOff, Eye, XCircle, Pencil, Loader2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState, useEffect, useMemo, Dispatch, SetStateAction, ReactNode, createRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from './ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { generate_totp, generateQRCodeURL } from '@/app/action';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Project {
  id?: string,
  title: string;
  description: string;
  techStack: string[];
  githubRepo: string;
  demoUrl?: string;
  image?: string;
}

// [
//     { delay: 0.0, filter: '2', description: "HTML, CSS and JS", image: '/security.png', title: 'Lock Screen Page', link: 'https://ojutalayomi.githubRepo.io/security' },
//     { delay: 0.2, filter: '1', description: "Next.JS, TailwindCSS, Redis, Express JS and MongoDB", image: '/velo-virid.vercel.png', title: 'Velo', link: 'https://velo-virid.vercel.app' },
//     { delay: 0.4, filter: '2', description: "HTML, CSS and JS", image: '/noow.png', title: 'Sign-In/Sign-Up Page', link: 'https://ojutalayomi.githubRepo.io/Newsletter-sign-up' },
//     { delay: 0.6, filter: '2', description: "HTML, SCSS and JS", image: '/analytics-dashboard-362w.onrender.com_.png', title: 'Analytics Dashboard', link: 'https://analytics-dashboard-362w.onrender.com/' },
//     { delay: 0.8, filter: '2', description: "HTML, CSS and JS", image: '/ojutalayomi.githubRepo.io_Login_.png', title: 'Wuramide Cakes', link: 'https://ojutalayomi.githubRepo.io/Login' },
//     { delay: 1.0, filter: '2', description: "HTML, SCSS and JS", image: '/natoplus.png', title: 'NatoPlus', link: 'https://ojutalayomi.githubRepo.io/natoplus' },
//     { delay: 1.2, filter: '1', description: "Next.JS, TailwindCSS, ShadCN, Golang, Redis and MongoDB", image: '/facey.vercel.app.png', title: 'Facey', link: 'https://facey.vercel.app' },
//     { delay: 1.4, filter: '1', description: "HTML, CSS, JS and Express JS", image: '/portfolio.page.png', title: 'My Portfolio', link: 'https://portfolio-enb2.onrender.com' }
// ]



export default function MainSections() {
  // Memoize projects array to avoid useEffect dependency warning

  const projects: Project[] = useMemo(() => [
    {
      "title": "Analytics Dashboard",
      "description": "Developed a comprehensive dashboard for tracking website traffic, user engagement, and performance metrics. Implemented real-time data visualization with customizable widgets for enhanced user insights.",
      "techStack": ["HTML", "CSS", "SCSS", "JavaScript"],
      "githubRepo": "analytics-dashboard",
      "demoUrl": "https://analytics-dashboard-362w.onrender.com",
      "image": "/analytics-dashboard-362w.onrender.com_.png"
    },
    {
      "title": "Social Media Platform – Velo",
      "description": "Designed and built a full-stack social media platform with features such as real-time messaging, authentication, and multimedia content sharing. Leveraged Redis caching to reduce server response times by 25%.",
      "techStack": ["React", "Next.js", "TypeScript", "Node.js (Socket Server)", "MongoDB", "Redis"],
      "githubRepo": "velo",
      "demoUrl": "https://velo-virid.vercel.app",
      "image": "/velo-virid.vercel.png"
    },
    {
      "title": "Video Conferencing App – FaceY",
      "description": "Engineered a secure and scalable video conferencing app with real-time video, messaging, and session management. Built using Golang for efficient socket handling and low-latency communication.",
      "techStack": ["React", "Next.js", "MongoDB", "Tailwind CSS", "Golang (Socket Server)"],
      "githubRepo": "facey",
      "demoUrl": "https://facey.vercel.app",
      "image": "/facey.vercel.app.png"
    },
    {
      "title": "E-commerce Platform – Petty Shelter",
      "description": "Created a full-featured online store for pet-related products and services. Integrated secure payment processing, admin dashboards, and role-based access control for customers and store managers.",
      "techStack": ["React", "Express.js", "MongoDB", "Tailwind CSS"],
      "githubRepo": "pet-shelter",
      "demoUrl": "https://petty-store.vercel.app",
      "image": "/petty-store.vercel.app(1).png"
    }
  ], []);
  

  // Dialog state and form fields
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubRepo: '',
    demoUrl: '',
    image: ''
  });
  const [projectsInText, setProjectsInText] = useState('');
  const textareaPlaceholder = `Paste your projects here as a JSON array. Example:
  [
    {
      "title": "Project Title",
      "description": "Short description of the project.",
      "techStack": ["React", "TypeScript"],
      "githubRepo": "repo-name",
      "demoUrl": "https://demo-link.com",
      "image": "/path/to/image.png"
    }
  ]
  `
  const [textareaError, setTextareaError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Add authentication state
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // State for input OTP
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // QR code state
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // useEffect(() => {
  //   // Generate a secret key for TOTP
  //   console.log(generate_secret_key())
  // }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // On Mac: metaKey is the Command key
      if ((e.metaKey || e.ctrlKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Generate QR code URL for Google Authenticator
    generateQRCodeURL()
      .then((dataURL) => {
        setQrCodeUrl(dataURL as string);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setQrCodeUrl('');
      });
  }, [open]);

  useEffect(() => {
    // Verify OTP when it changes
    if (otp.length !== 6) return;
    setOtpLoading(true);
    fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        setOtpVerified(true);
        toast.success('OTP verified successfully');
        setOtpError('');
        setTimeout(() => {
          setOtpLoading(false)
          setOtpVerified(false)
        }, 2500 * 10);
      } else {
        console.error("OTP failed:", data.error);
        setOtpError('Invalid OTP');
        setOtpLoading(false)
        toast.error(data.error || 'Invalid OTP');
        setOtpVerified(false);
      }
    })
    .catch(error => {
      toast.error(error instanceof Error ? error.message : 'Error verifying OTP');
      console.error("Network error:", error);
      setOtpError('Network error verifying OTP');
    }).finally(() => {
      setOtp('');
    });
  }, [otp]);

  // Fetch projects from Postgres
  useEffect(() => {
    async function fetchProjects() {
      try {
        // vercel/postgres returns QueryResultRow, not Project
        const res = await sql`SELECT * FROM projects ORDER BY id DESC`;
        setDbProjects(res.rows.map((row: Record<string, string>) => ({
          id: row?.id,
          title: row.title,
          description: row.description,
          techStack: row.tech_stack ? row.tech_stack.split(',').map((t: string) => t.trim()) : [],
          githubRepo: row.github_repo,
          demoUrl: row.demo_url,
          image: row.image
        })));
      } catch {
        setDbProjects(projects);
      }
    }
    fetchProjects();
  }, [projects]);

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form textarea
  function handleChangeForTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextareaError('')
    const rawInput = e.target.value;
    setProjectsInText(rawInput);
    try {
      const parsedProjects = JSON.parse(rawInput);
      if (!rawInput) {
        setTextareaError('');
        return;
      }
      if (!Array.isArray(parsedProjects)) {
        setTextareaError("Input is not a valid array of projects.");
      }
      if (parsedProjects.length === 0) {
        setTextareaError("Input array is empty. Please provide at least one project.");
      }
      // Validate each project object
      parsedProjects.map((project: Project) => {
        if (!project.title) {
          setTextareaError("Each project must have a title.");
        } else if (!project.description) {
          setTextareaError("Each project must have a description.");
        } else if (!project.techStack) {
          setTextareaError("Each project must have a techStack field.");
        } else if (!project.githubRepo) {
          setTextareaError("Each project must have a githubRepo field.");
        } else if (!project.image) {
          setTextareaError("Each project must have an image field.");
        } else if (!project.demoUrl) {
          setTextareaError("Each project must have a demoUrl field.");
        }
        // console.log(project)
      })
    } catch (error) {
      // console.error("Error parsing JSON:", error);
      if (!rawInput) {
        return;
      }
      setTextareaError(`${error}`);
    }
  }

  // Handle auth input
  function handleAuthChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          tech_stack TEXT NOT NULL,
          github_repo TEXT NOT NULL,
          demo_url TEXT,
          image TEXT,
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          last_updated TIMESTAMPTZ DEFAULT NOW()
        )
      `;
      // Check if the event target contains a textarea with id "textareaM"
      const textarea = (e.target as HTMLElement).querySelector?.('textarea#textareaM');
      if (textarea) {
        const rawInput = textarea.innerHTML;
        const parsedProjects = JSON.parse(rawInput);
        if (Array.isArray(parsedProjects)) {
          for (const project of parsedProjects) {
            await sql`
              INSERT INTO projects (title, description, tech_stack, github_repo, demo_url, image, timestamp, last_updated)
              VALUES (
                ${project.title},
                ${project.description},
                ${Array.isArray(project.techStack) ? project.techStack.join(',') : project.techStack},
                ${project.githubRepo},
                ${project.demoUrl},
                ${project.image},
                ${new Date().toISOString()},
                ${new Date().toISOString()}
              )
            `;
          }
        }
      } else {
        await sql`
          INSERT INTO projects (title, description, tech_stack, github_repo, demo_url, image, timestamp, last_updated)
          VALUES (${form.title}, ${form.description}, ${form.techStack}, ${form.githubRepo}, ${form.demoUrl}, ${form.image}, ${new Date().toISOString()}, ${new Date().toISOString()})
        `;
      }
      const res = await sql`SELECT * FROM projects ORDER BY id DESC`;
      setDbProjects(res.rows.map((row: Record<string, string>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        techStack: row.tech_stack ? row.tech_stack.split(',').map((t: string) => t.trim()) : [],
        githubRepo: row.github_repo,
        demoUrl: row.demo_url,
        image: row.image
      })));
      setOpen(false);
      setForm({ title: '', description: '', techStack: '', githubRepo: '', demoUrl: '', image: '' });
    } catch (err) {
      console.log(err);
      toast.error('Failed to add project');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      if (!otpVerified) return;
      // Check credentials in portfolio_editors table
      const authRes = await sql`
        SELECT * FROM portfolio_editors WHERE username = ${auth.username} AND password = ${auth.password}
      `;
      if (!authRes.rows.length) {
        setAuthError('Invalid username or password');
        setLoading(false);
        return;
      }
      setAuthSuccess(true);
      // setOpen(false);
      setAuth({ username: '', password: '' });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to authenticate.')
      console.log(err);
      toast.error('Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  }

  const copyQRCode = () => {
    setCopied(true);
    toast.success('QR Code copied to clipboard. Add it to your google authenticator app to get OTP');
    if (!qrCodeUrl) {
      toast.error('QR Code not available');
      return;
    }
    navigator.clipboard.writeText(generate_totp())
      .catch(err => {
        console.error("Failed to copy QR code:", err);
        toast.error('Failed to copy QR Code');
      });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Add Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button className="mb-6">Add New Project</Button> */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={authSuccess ? handleSubmit : handleLogin} className="space-y-4 overflow-auto max-h-[80dvh] p-1">
            <Tabs defaultValue={authSuccess ? "addProject" : "authenticate"} value={authSuccess ? "addProject" : "authenticate"}>
              <TabsList hidden className='hidden'>
                <TabsTrigger value="authenticate">Authenticate</TabsTrigger>
                <TabsTrigger value="addProject">Add Project</TabsTrigger>
              </TabsList>
              <TabsContent value="authenticate" className="space-y-4">
                <div className="flex flex-col gap-3 items-center justify-center mt-4">
                  {/* Auth fields */}
                  <Label className="text-start w-full" htmlFor='username'>Username</Label>
                  <Input id="username" name="username" placeholder="Username" value={auth.username} onChange={handleAuthChange} required />
                  <Label className="text-start w-full" htmlFor='password'>Password</Label>
                  <div className='relative w-full'>
                    <Input className='w-full' id="password" name="password" placeholder="Password" type={showPassword ? 'text' : 'password'} value={auth.password} onChange={handleAuthChange} required />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {authError && (
                    <div className='w-full border border-red-500 rounded bg-red-100 flex gap-2 items-center justify-center p-2 shadow-lg'>
                      <XCircle className='text-red-500'/>
                      <span className=''>{authError}</span>
                    </div>
                  )}

                  <Label className="text-start w-full" htmlFor='otp'>Authentication Code</Label>
                  <InputOTP id="otp" value={otp} onChange={setOtp} maxLength={6} disabled={otpLoading} className="w-full" containerClassName={`${otpError ? 'border-red-600 outline-red-600': ''} border-black-500`}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  
                  <Button type="submit" className={`w-full ${loading || !otpVerified ? 'cursor-not-allowed' : ''}`} disabled={loading || !otpVerified}>{loading ? 'Loading...' : 'Continue'}</Button>
                </div>

                <div className="mb-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Scan with Google Authenticator
                      </span>
                    </div>
                    
                    <div className="relative bg-white rounded-2xl p-3 shadow-sm">
                      <div className="w-40 h-40 p-1 mx-auto bg-white rounded-xl overflow-hidden shadow-inner">
                        {qrCodeUrl && <img src={qrCodeUrl} className='w-full h-full ' alt='Authenticator QR Code' />}
                      </div>
                      
                      <button
                        onClick={copyQRCode}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Open your authenticator app and scan the QR code above
                    </p>
                  </div>
                </div>

              </TabsContent>
              <TabsContent value="addProject" className="space-y-4">
                {authError && <div className="text-red-500 text-sm">{authError}</div>}
                {/* Project fields */}
                <Tabs defaultValue="single">
                  <TabsList>
                    <TabsTrigger value="" disabled className="disabled:opacity-100">Projects: </TabsTrigger>
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="multiple">Multiple</TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="space-y-4">
                    <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                    <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 rounded border" required />
                    <Input name="tech" placeholder="Tech (comma separated)" value={form.techStack} onChange={handleChange} required />
                    <Input name="github" placeholder="GitHub repo name" value={form.githubRepo} onChange={handleChange} required />
                    <Input name="demo" placeholder="Demo URL" value={form.demoUrl} onChange={handleChange} />
                    <Input name="img" placeholder="Image path" value={form.image} onChange={handleChange} />
                  </TabsContent>
                  <TabsContent value="multiple" className="space-y-4">
                    <div className="text-xs text-gray-500 mt-2">
                      Please enter a valid JSON array of project objects. Each object should include: <b>title</b>, <b>description</b>, <b>techStack</b> (array), <b>githubRepo</b>, <b>demoUrl</b>, and <b>image</b>.
                    </div>
                    <Textarea
                      id="textareaM"
                      name="projects"
                      placeholder={textareaPlaceholder}
                      value={projectsInText}
                      onChange={handleChangeForTextArea}
                      className="w-full min-h-80 p-2 rounded border"
                      required
                    />
                    {textareaError && <div className="text-red-500 text-sm">{textareaError}</div>}
                  </TabsContent>
                </Tabs>
                <Button type="submit" className='w-full' disabled={loading}>{loading ? 'Adding...' : 'Add Project'}</Button>
              </TabsContent>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>
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
          {(dbProjects.length ? dbProjects : projects).map((project, index) => (
            <div key={index} className="flex flex-col items-center border dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={project.image} alt={project.title} className="w-full h-auto object-cover rounded-t-xl mb-4" />
              <div className="relative p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((techStack: string, techIndex: number) => (
                    <span key={techIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">{techStack.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={"https://github.com/ojutalayomi/"+project.githubRepo} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" target="_blank" rel="noreferrer">
                    <FaGithub className="mr-2" /> Code
                  </a>
                  {project.demoUrl && (
                    <a href={project.demoUrl} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" target="_blank" rel="noreferrer">
                      <FaExternalLinkAlt className="mr-2" /> Demo
                    </a>
                  )}
                  {authSuccess && (
                    <ProjectEditOrDelete id={project.id || ''} projects={dbProjects} setProjects={setDbProjects}>
                      <div className='absolute bottom-0 right-0 flex gap-2 items-center p-2 m-2 cursor-pointer rounded-lg hover:border border-red-500'>
                        <Pencil size={15}/>
                        <span>Edit</span>
                      </div>
                    </ProjectEditOrDelete>
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

export function ProjectEditOrDelete({ children, id, projects, setProjects }: { children: ReactNode, id: string, projects: Project[], setProjects: Dispatch<SetStateAction<Project[]>>  }) {
  const project = projects.find(project => project.id === id);
  const [loading, setLoading] = useState({ edit: false, delete: false });
  const cancelButtonRef = useMemo(() => createRef<HTMLButtonElement>(), []);
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubRepo: '',
    demoUrl: '',
    image: ''
  });

  useEffect(() => {
    setForm({
      title: project?.title || '',
      description: project?.description || '',
      techStack: project?.techStack.join(', ') || '',
      githubRepo: project?.githubRepo || '',
      demoUrl: project?.demoUrl || '',
      image: project?.image || ''
    })
  }, [project])

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading({ edit: true, delete: false });
    try {
      await sql`
        UPDATE projects
        SET
          title = ${form.title},
          description = ${form.description},
          tech_stack = ${form.techStack},
          github_repo = ${form.githubRepo},
          demo_url = ${form.demoUrl},
          image = ${form.image},
          lastUpdated = ${new Date().toISOString()}
        WHERE id = ${id}
      `;
      const res = await sql`SELECT * FROM projects ORDER BY id DESC`;
      // if (res.rows.length < 0) return;
      setProjects(res.rows.map((row: Record<string, string>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        techStack: row.tech_stack ? row.tech_stack.split(',').map((t: string) => t.trim()) : [],
        githubRepo: row.github_repo,
        demoUrl: row.demo_url,
        image: row.image
      })));
      cancelButtonRef.current?.click();
    } catch (err) {
      console.log(err);
      toast.error('Failed to add project');
    } finally {
      setLoading({ edit: false, delete: false });
    }
  }

  async function handleDelete() {
    if (!project) return;
    setLoading({ edit: false, delete: true });

    try {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      const res = await sql`SELECT * FROM projects ORDER BY id DESC`;
      setProjects(res.rows.map((row: Record<string, string>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        techStack: row.tech_stack ? row.tech_stack.split(',').map((t: string) => t.trim()) : [],
        githubRepo: row.github_repo,
        demoUrl: row.demo_url,
        image: row.image
      })));
      cancelButtonRef.current?.click();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete project');
    } finally {
      setLoading({ edit: false, delete: false });
    }
  }

  if (!project) return null;

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Make changes to this project here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Title</Label>
              <Input id="name-1" name="name" value={form.title} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input id="techStack" name="techStack" value={form.techStack} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="githubRepo">Github Repo</Label>
              <Input id="githubRepo" name="githubRepo" value={form.githubRepo} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="demoUrl">Demo Url</Label>
              <Input id="demoUrl" name="demoUrl" value={form.demoUrl} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" value={form.image} onChange={handleChange} />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={cancelButtonRef} disabled={loading.edit || loading.delete}>Cancel</Button>
            </DialogClose>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="destructive" disabled={loading.edit || loading.delete}>
                  {loading.delete ? <Loader2 className='animate-spin size-4'/> : <>Delete Project</>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                Are you sure you want to delete this project?
                <div className="mt-2 flex items-center justify-between">
                  <Button variant="destructive" onClick={handleDelete} disabled={loading.edit || loading.delete}>
                    {loading.delete ? <Loader2 className='animate-spin size-4'/> : <>Yes, delete</>}
                  </Button>
                  <Button variant="secondary" onClick={() => cancelButtonRef.current?.click()} disabled={loading.edit || loading.delete}>
                    Cancel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button type="submit" disabled={loading.edit || loading.delete} onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
              {loading.edit || loading.delete ? <>Loading...</> : <>Save changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}