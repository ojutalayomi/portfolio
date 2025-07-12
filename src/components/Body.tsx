/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { sql } from '@vercel/postgres';
import { Card, CardContent } from './ui/card';
import { Cpu, Code2, Smartphone, CheckCircle, Copy, EyeOff, Eye, XCircle, Pencil, Loader2, Settings, BookOpenCheck, Search, ArrowUpDown, ImageOff } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState, useEffect, useMemo, Dispatch, SetStateAction, ReactNode, createRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { generateQRCodeURL } from '@/app/action';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { json } from '@codemirror/lang-json';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTheme } from '@/providers/theme-provider';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';
import { Project } from '@/lib/types';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const projectSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'description', 'techStack', 'githubRepo', 'demoUrl', 'image', 'imageAlt', 'dateAdded'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      techStack: {
        anyOf: [
          { type: 'array', items: { type: 'string' } },
          { type: 'string' }
        ]
      },
      githubRepo: { type: 'string' },
      demoUrl: { type: 'string', format: 'uri' },
      image: { type: 'string' },
      imageAlt: { type: 'string' },
      dateAdded: { type: 'string', format: 'date' }
    }
  }
};

const validate = ajv.compile(projectSchema);


export default function MainSections() {
  const { theme } = useTheme()
  // Memoize projects array to avoid useEffect dependency warning

  const projects: Project[] = useMemo(() => [
    {
      "title": "Analytics Dashboard",
      "description": "Developed a comprehensive dashboard for tracking website traffic, user engagement, and performance metrics. Implemented real-time data visualization with customizable widgets for enhanced user insights.",
      "techStack": ["HTML", "CSS", "SCSS", "JavaScript"],
      "githubRepo": "analytics-dashboard",
      "demoUrl": "https://analytics-dashboard-362w.onrender.com",
      "image": "/analytics-dashboard-362w.onrender.com_.png",
      "imageAlt": "Analytics Dashboard",
      "dateAdded": ""
    },
    {
      "title": "Social Media Platform – Velo",
      "description": "Designed and built a full-stack social media platform with features such as real-time messaging, authentication, and multimedia content sharing. Leveraged Redis caching to reduce server response times by 25%.",
      "techStack": ["React", "Next.js", "TypeScript", "Node.js (Socket Server)", "MongoDB", "Redis"],
      "githubRepo": "velo",
      "demoUrl": "https://velo-virid.vercel.app",
      "image": "/velo-virid.vercel.png",
      "imageAlt": "Velo Social Media Platform",
      "dateAdded": ""
    },
    {
      "title": "Video Conferencing App – FaceY",
      "description": "Engineered a secure and scalable video conferencing app with real-time video, messaging, and session management. Built using Golang for efficient socket handling and low-latency communication.",
      "techStack": ["React", "Next.js", "MongoDB", "Tailwind CSS", "Golang (Socket Server)"],
      "githubRepo": "facey",
      "demoUrl": "https://facey.vercel.app",
      "image": "/facey.vercel.app.png",
      "imageAlt": "FaceY Video Conferencing App",
      "dateAdded": ""
    },
    {
      "title": "E-commerce Platform – Petty Shelter",
      "description": "Created a full-featured online store for pet-related products and services. Integrated secure payment processing, admin dashboards, and role-based access control for customers and store managers.",
      "techStack": ["React", "Express.js", "MongoDB", "Tailwind CSS"],
      "githubRepo": "pet-shelter",
      "demoUrl": "https://petty-store.vercel.app",
      "image": "/petty-store.vercel.app(1).png",
      "imageAlt": "Petty Shelter E-commerce Platform",
      "dateAdded": ""
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
    image: '',
    imageAlt: '',
    dateAdded: ''
  });
  const [tabValue, setTabValue] = useState<'single' | 'multiple'>('single');

  const textareaPlaceholder = `[
  {
    'title': '',
    'description': '',
    'techStack': '',
    'githubRepo': '',
    'demoUrl': '',
    'image': '',
    'imageAlt': '',
    'dateAdded': 'dd/mm/yyyy',
  }
]`
  const [projectsInText, setProjectsInText] = useState(textareaPlaceholder);
  const [textareaError, setTextareaError] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'tech'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAnimations, setShowAnimations] = useState(true);
  const [projectViews, setProjectViews] = useState<Record<string, number>>({});

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
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState({ url: '', key: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // On Mac: metaKey is the Command key
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setOpen(true);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          setShowQRCode(!showQRCode);
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          // Focus search input
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            (searchInput as HTMLInputElement).focus();
          }
        } else if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setShowAnimations(prev => !prev);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
        // Clear search when pressing Escape
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQRCode]);

  useEffect(() => {
    if (!open) return;
    // Generate QR code URL for Google Authenticator
    generateQRCodeURL()
      .then((data => {
        const { dataURL, key } = data as { dataURL: string, key: string };
        setQrCodeUrl({url: dataURL, key});
      }))
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setQrCodeUrl({url: '', key: ''});
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
          image: row.image,
          imageAlt: row.image_alt,
          dateAdded: row.date_added
        })));
      } catch {
        setDbProjects(projects);
      }
    }
    fetchProjects();
  }, [projects]);

  useEffect(() => {
    toast.error(textareaError, {
      duration: 5000,
      position: 'top-center',
    })
  }, [textareaError]);

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form textarea
  function handleChangeForCodeMirror(value: string) {
    setProjectsInText(value);
    try {
      const parsedProjects = JSON.parse(value);

      if (!validate(parsedProjects)) {
        const validationErrors = validate.errors?.map(e => `• ${e.instancePath} ${e.message}`) || [];
        setErrors(validationErrors);
        return;
      }

      setErrors([]);
    } catch (error) {
      // console.error("Error parsing JSON:", error);
      if (!value.trim()) {
        return;
      }
      setTextareaError(`${error}`);
    }
  }

  // Handle auth input
  function handleAuthChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  }

  // Handle filter toggle
  function handleFilterToggle(tech: string) {
    setActiveFilters(prev => 
      prev.includes(tech) 
        ? prev.filter(filter => filter !== tech)
        : [...prev, tech]
    );
  }

  // Handle favorite toggle
  function handleFavoriteToggle(projectId: string) {
    setFavoriteProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  }

  // Track project view
  function trackProjectView(projectId: string) {
    setProjectViews(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1
    }));
  }

  // Get all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    (dbProjects.length ? dbProjects : projects).forEach(project => {
      project.techStack.forEach(tech => techSet.add(tech.trim()));
    });
    return Array.from(techSet).sort();
  }, [dbProjects, projects]);

  // Get project categories
  const projectCategories = useMemo(() => {
    const categories = new Set<string>();
    (dbProjects.length ? dbProjects : projects).forEach(project => {
      // Determine category based on tech stack
      if (project.techStack.some(tech => ['React', 'Next.js', 'Vue', 'Angular'].includes(tech))) {
        categories.add('Frontend');
      }
      if (project.techStack.some(tech => ['Node.js', 'Express', 'Python', 'Golang', 'FastAPI'].includes(tech))) {
        categories.add('Backend');
      }
      if (project.techStack.some(tech => ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'].includes(tech))) {
        categories.add('Database');
      }
      if (project.techStack.some(tech => ['HTML', 'CSS', 'SCSS', 'JavaScript'].includes(tech))) {
        categories.add('Web');
      }
    });
    return ['all', ...Array.from(categories).sort()];
  }, [dbProjects, projects]);

  // Enhanced filter, search, and sort projects
  const filteredProjects = useMemo(() => {
    let projectsToFilter = dbProjects.length ? dbProjects : projects;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      projectsToFilter = projectsToFilter.filter(project => {
        const techStack = project.techStack.map(tech => tech.trim());
        switch (selectedCategory) {
          case 'Frontend':
            return techStack.some(tech => ['React', 'Next.js', 'Vue', 'Angular'].includes(tech));
          case 'Backend':
            return techStack.some(tech => ['Node.js', 'Express', 'Python', 'Golang', 'FastAPI'].includes(tech));
          case 'Database':
            return techStack.some(tech => ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'].includes(tech));
          case 'Web':
            return techStack.some(tech => ['HTML', 'CSS', 'SCSS', 'JavaScript'].includes(tech));
          default:
            return true;
        }
      });
    }
    
    // Filter by technology
    if (activeFilters.length > 0) {
      projectsToFilter = projectsToFilter.filter(project => {
        // Check if favorites filter is active
        if (activeFilters.includes('favorites')) {
          return favoriteProjects.includes(project.id || '');
        }
        
        // Check technology filters
        return activeFilters.some(filter => 
          project.techStack.some(tech => tech.trim().toLowerCase() === filter.toLowerCase())
        );
      });
    }
    
    // Search functionality
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      projectsToFilter = projectsToFilter.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query))
      );
    }
    
    // Sort projects
    projectsToFilter.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'tech':
          comparison = a.techStack.join(', ').localeCompare(b.techStack.join(', '));
          break;
        case 'date':
        default:
          comparison = new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return projectsToFilter;
  }, [dbProjects, projects, activeFilters, searchQuery, sortBy, sortOrder, selectedCategory, favoriteProjects]);

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
          image_alt TEXT DEFAULT 'Project Image',
          date_added DATE DEFAULT NOW(),
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          last_updated TIMESTAMPTZ DEFAULT NOW()
        )
      `;
      // Check if the event target contains a textarea with id "textareaM"
      if (tabValue === 'multiple' && projectsInText.trim()) {
        const rawInput = projectsInText.trim();
        const parsedProjects = JSON.parse(rawInput);
        if (Array.isArray(parsedProjects)) {
          for (const project of parsedProjects) {
            await sql`
              INSERT INTO projects (title, description, tech_stack, github_repo, demo_url, image, image_alt, date_added, timestamp, last_updated)
              VALUES (
                ${project.title},
                ${project.description},
                ${Array.isArray(project.techStack) ? project.techStack.join(',') : project.techStack},
                ${project.githubRepo},
                ${project.demoUrl},
                ${project.image},
                ${project.imageAlt},
                ${project.dateAdded},
                ${new Date().toISOString()},
                ${new Date().toISOString()}
              )
            `;
          }
        }
      } else {
        await sql`
          INSERT INTO projects (title, description, tech_stack, github_repo, demo_url, image, image_alt, date_added, timestamp, last_updated)
          VALUES (${form.title}, ${form.description}, ${form.techStack}, ${form.githubRepo}, ${form.demoUrl}, ${form.image}, ${form.imageAlt}, ${form.dateAdded}, ${new Date().toISOString()}, ${new Date().toISOString()})
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
        image: row.image,
        imageAlt: row.image_alt,
        dateAdded: row.date_added
      })));
      setOpen(false);
      toast.success('Project added successfully');
      if (projectsInText) {
        setProjectsInText(textareaPlaceholder)
        setTextareaError('');
      } else {
        setForm({ title: '', description: '', techStack: '', githubRepo: '', demoUrl: '', image: '', imageAlt: '', dateAdded: '' });
      }
    } catch (err) {
      // console.log(err);
      toast.error(err instanceof Error ? err.message : 'Failed to add project');
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
      // console.log(err);
      toast.error('Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  }

  const copyQRCode = () => {
    setCopied(true);
    toast.success('Secret code copied to clipboard. Add it to your google authenticator app to get OTP');
    if (!qrCodeUrl.key) {
      toast.error('Secret Code not available');
      return;
    }
    navigator.clipboard.writeText(qrCodeUrl.key)
      .catch(err => {
        console.error("Failed to copy Secret code:", err);
        toast.error('Failed to copy Secret Code');
      });
    setTimeout(() => setCopied(false), 2000);
  };

  // Export filtered projects
  const exportProjects = (format: 'json' | 'csv') => {
    if (filteredProjects.length === 0) {
      toast.error('No projects to export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `projects-${timestamp}.${format}`;

    if (format === 'json') {
      const dataStr = JSON.stringify(filteredProjects, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Title', 'Description', 'Tech Stack', 'GitHub Repo', 'Demo URL', 'Date Added'];
      const csvContent = [
        headers.join(','),
        ...filteredProjects.map(project => [
          `"${project.title}"`,
          `"${project.description.replace(/"/g, '""')}"`,
          `"${project.techStack.join(', ')}"`,
          `"${project.githubRepo}"`,
          `"${project.demoUrl || ''}"`,
          `"${project.dateAdded}"`
        ].join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Exported ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} as ${format.toUpperCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Add Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button className="mb-6">Add New Project</Button> */}
        </DialogTrigger>
        <DialogContent className='gap-0'>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={authSuccess ? handleSubmit : handleLogin} className="space-y-4 overflow-auto max-h-[85dvh] p-1">
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

                {showQRCode && (
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
                          {qrCodeUrl.url && <img src={qrCodeUrl.url} className='w-full h-full ' alt='Authenticator QR Code' />}
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
                )}

              </TabsContent>
              <TabsContent value="addProject" className="space-y-4">
                {authError && <div className="text-red-500 text-sm">{authError}</div>}
                {/* Project fields */}
                <Tabs defaultValue="single" value={tabValue} onValueChange={(e) => setTabValue(e as 'single' | 'multiple')}>
                  <TabsList>
                    <TabsTrigger value="" disabled className="disabled:opacity-100">Projects: </TabsTrigger>
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="multiple">Multiple</TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="space-y-4">
                    <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                    <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 rounded border" required />
                    <Input name="techStack" placeholder="Tech (comma separated)" value={form.techStack} onChange={handleChange} required />
                    <Input name="githubRepo" placeholder="GitHub repo name" value={form.githubRepo} onChange={handleChange} />
                    <Input name="demoUrl" placeholder="Demo URL" value={form.demoUrl} onChange={handleChange} />
                    <Input name="image" placeholder="Image path" value={form.image} onChange={handleChange} />
                    <Input name="imageAlt" placeholder="Image alt text" value={form.imageAlt} onChange={handleChange} />
                    <Input id="dateAdded1" name="dateAdded" type='date' value={form.dateAdded} onChange={handleChange} />
                  </TabsContent>
                  <TabsContent value="multiple" className="space-y-4">
                    <div className="text-xs text-gray-500 mt-2">
                      Please enter a valid JSON array of project objects. Each object should include: <b>title</b>, <b>description</b>, <b>techStack</b> (array), <b>githubRepo</b>, <b>demoUrl</b>, <b>image</b>, <b>imageAlt</b> and <b>dateAdded</b>.
                    </div>
                    <CodeMirror
                      value={projectsInText}
                      height="400px"
                      theme={theme === "light" ? githubLight : githubDark}
                      extensions={[json()]}
                      onChange={handleChangeForCodeMirror}
                    />

                    {errors.length > 0 && (
                      <div className="mt-4 bg-red-100 p-3 text-red-700 rounded">
                        <strong>Validation Errors:</strong>
                        <ul className="list-disc ml-5">
                          {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    )}
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
          <section className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Settings className="w-5 h-5" />
                <span>About Me</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                I&apos;m a 300-level Computer Science student at the University of Lagos with a growing expertise in full-stack and backend development. My programming journey began in <strong>November 2022</strong> with HTML, CSS, and JavaScript. In <strong>December 2023</strong>, I stepped into backend development using <strong>Express.js</strong>, building my first full-stack social media app from scratch.
              </p>
              <p className="mt-2 text-muted-foreground">
                Since then, I&apos;ve built a variety of projects — from real-time social platforms and analytics dashboards to CLI tools and embedded APIs — including the very <strong>portfolio</strong> you&apos;re browsing now, built with <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>PostgreSQL</strong>.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <BookOpenCheck className="w-5 h-5" />
                <span>Currently Learning & Growing</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                With a strong foundation in <strong>data structures</strong>, <strong>algorithms</strong>, and <strong>cloud computing</strong>, I&apos;m always pushing my limits to become a well-rounded software engineer. When I&apos;m not coding, I contribute to <strong>open-source projects</strong> and <strong>mentor junior developers</strong>, helping them take their first steps in tech.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Code2 className="w-5 h-5" />
                <span>My Stack</span>
              </div>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                <li><strong>Frontend:</strong> React, Next.js, Tailwind CSS, SCSS</li>
                <li><strong>Languages:</strong> TypeScript, JavaScript, Python (FastAPI), Golang, Node.js, C#</li>
                <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</li>
                <li><strong>Exploring:</strong> System design, Concurrency, File-based storage, Scalable backend services</li>
              </ul>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <h2 className="text-3xl text-center font-bold my-8 text-gray-800 dark:text-white">Projects ({filteredProjects.length})</h2>
        
        {/* Project Statistics */}
        <div className="mb-6 text-center">
          <div className="inline-flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {dbProjects.length || projects.length}</span>
            <span>•</span>
            <span>Showing: {filteredProjects.length}</span>
            <span>•</span>
            <span>Technologies: {allTechnologies.length}</span>
            <span>•</span>
            <span>Categories: {projectCategories.length - 1}</span>
          </div>
        </div>

        {/* Enhanced Project Statistics Dashboard */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Projects</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{dbProjects.length || projects.length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Favorites</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">{favoriteProjects.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Total Views</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {Object.values(projectViews).reduce((sum, views) => sum + views, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">View Mode</p>
                  <p className="text-lg font-bold text-orange-800 dark:text-orange-200 capitalize">{viewMode}</p>
                </div>
                <div className="w-8 h-8 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search, Sort, and Category Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Input
                id="search-input"
                type="text"
                placeholder="Search projects by title, description, or tech stack... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Sort and Category Controls */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Label htmlFor="category" className="text-sm font-medium">Category:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy" className="text-sm font-medium">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'title' | 'tech')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUpDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 rotate-180" />
                )}
              </button>
            </div>

            {/* Clear All Filters */}
            {(searchQuery || selectedCategory !== 'all' || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveFilters([]);
                }}
                className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded-md transition-colors"
              >
                Clear All Filters
              </button>
            )}

            {/* Export Buttons */}
            {filteredProjects.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => exportProjects('json')}
                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors"
                  title="Export as JSON"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => exportProjects('csv')}
                  className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md transition-colors"
                  title="Export as CSV"
                >
                  Export CSV
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">View:</Label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Grid View"
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="List View"
                >
                  List
                </button>
              </div>
            </div>

            {/* Favorites Filter */}
            {favoriteProjects.length > 0 && (
              <button
                onClick={() => setActiveFilters(prev => 
                  prev.includes('favorites') 
                    ? prev.filter(f => f !== 'favorites')
                    : [...prev, 'favorites']
                )}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeFilters.includes('favorites')
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Show Favorites"
              >
                ⭐ Favorites ({favoriteProjects.length})
              </button>
            )}

            {/* Keyboard Shortcuts Help */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="Keyboard Shortcuts"
                >
                  ⌨️ Shortcuts
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Search Projects</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘K</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toggle View Mode</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘G</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toggle Animations</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘F</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Add Project</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘L</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toggle QR Code</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘M</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Close/Reset</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Esc</kbd>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedCategory !== 'all' || activeFilters.length > 0) && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <span>Active filters: </span>
              {searchQuery && <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-2">Search: &quot;{searchQuery}&quot;</span>}
              {selectedCategory !== 'all' && <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded mr-2">Category: {selectedCategory}</span>}
              {activeFilters.map((filter) => (
                <span key={filter} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded mr-2">
                  Tech: {filter}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Filter Buttons */}
        {allTechnologies.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleFilterToggle(tech)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilters.includes(tech)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {tech}
                </button>
              ))}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
            {activeFilters.length > 0 && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} with {activeFilters.join(', ')}
              </p>
            )}
          </div>
        )}
        
        <div className={`gap-6 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'flex flex-col gap-4'
        }`}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div key={index} className={`relative ${
                showAnimations ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-500' : ''
              }`} style={{ animationDelay: `${index * 100}ms` }}>
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <ProjectDetailsDialog project={project} onView={() => trackProjectView(project.id || '')} />
                    {authSuccess && (
                      <ProjectEditOrDelete id={project.id || ''} projects={dbProjects} setProjects={setDbProjects}>
                        <div className='absolute top-2 right-2 flex gap-2 items-center p-2 m-2 cursor-pointer rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors z-10'>
                          <Pencil size={15}/>
                          <span className="text-sm">Edit</span>
                        </div>
                      </ProjectEditOrDelete>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(project.id || '');
                      }}
                      className={`absolute top-2 left-2 p-2 rounded-lg transition-colors z-10 ${
                        favoriteProjects.includes(project.id || '')
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                      }`}
                      title={favoriteProjects.includes(project.id || '') ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      ⭐
                    </button>
                  </>
                ) : (
                  // List View
                  <div className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
                    <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Avatar className="w-20 h-20 object-cover rounded-lg">
                        <AvatarImage src={project.image || "/i.png"} alt={project.imageAlt} className="w-20 h-20 object-cover rounded-lg" />
                        <AvatarFallback className="w-20 h-20 object-cover rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <ImageOff className="w-8 h-8" />
                          <span className="sr-only">{project.imageAlt}</span>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(project.id || ''); }}
                            className={`p-1 rounded transition-colors ${
                              favoriteProjects.includes(project.id || '')
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                            title={favoriteProjects.includes(project.id || '') ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            ⭐
                          </button>
                          {authSuccess && (
                            <ProjectEditOrDelete id={project.id || ''} projects={dbProjects} setProjects={setDbProjects}>
                              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                <Pencil size={16}/>
                              </button>
                            </ProjectEditOrDelete>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {project.techStack.slice(0, 3).map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs">
                            {tech.trim()}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Views: {projectViews[project.id || ''] || 0}</span>
                        <span>Added: {new Date(project.dateAdded).toLocaleDateString()}</span>
                        {/* <ProjectDetailsDialog project={project} onView={() => trackProjectView(project.id || '')} /> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setActiveFilters([]);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function ProjectEditOrDelete({ children, id, projects, setProjects }: { children: ReactNode, id: string, projects: Project[], setProjects: Dispatch<SetStateAction<Project[]>>  }) {
  const project = projects.find(project => project.id === id);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState({ edit: false, delete: false });
  const cancelButtonRef = useMemo(() => createRef<HTMLButtonElement>(), []);
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubRepo: '',
    demoUrl: '',
    image: '',
    imageAlt: '',
    dateAdded: ''
  });

  useEffect(() => {
    setForm({
      title: project?.title || '',
      description: project?.description || '',
      techStack: project?.techStack.join(', ') || '',
      githubRepo: project?.githubRepo || '',
      demoUrl: project?.demoUrl || '',
      image: project?.image || '',
      imageAlt: project?.imageAlt || '',
      dateAdded: project?.dateAdded || ''
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
          image_alt = ${form.imageAlt},
          date_added = ${form.dateAdded},
          last_updated = ${new Date().toISOString()}
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
        image: row.image,
        imageAlt: row.image_alt,
        dateAdded: row.date_added
      })));
      setOpen(false);
      toast.success('Project updated successfully');
    } catch (err) {
      // console.log(err);
      toast.error(err instanceof Error ? err.message : 'Failed to add project');
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
        image: row.image,
        imageAlt: row.image_alt,
        dateAdded: row.date_added
      })));
      cancelButtonRef.current?.click();
    } catch (err) {
      // console.log(err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setLoading({ edit: false, delete: false });
    }
  }

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] sm:max-h-[90dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Make changes to this project here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
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
            <div className="grid gap-3">
              <Label htmlFor="imageAlt">Image Alt</Label>
              <Input id="imageAlt" name="imageAlt" value={form.imageAlt} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="dateAdded">Date Added</Label>
              <Input id="dateAdded2" name="dateAdded" type='date' value={form.dateAdded} onChange={handleChange} />
            </div>
          </form>
          <DialogFooter className="gap-y-2 sm:sticky sm:translate-y-[40%] bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t">
            <DialogClose asChild>
              <Button variant="outline" ref={cancelButtonRef} disabled={loading.edit || loading.delete}>Cancel</Button>
            </DialogClose>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading.edit || loading.delete}>
                  {loading.delete ? <Loader2 className='animate-spin size-4'/> : <>Delete Project</>}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    project and remove your data from our database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading.edit || loading.delete}>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading.edit || loading.delete}>
                      {loading.delete ? <Loader2 className='animate-spin size-4'/> : <>Yes, delete</>}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" disabled={loading.edit || loading.delete} onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
              {loading.edit || loading.delete ? <>Loading...</> : <>Save changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
