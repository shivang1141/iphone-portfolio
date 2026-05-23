// Every piece of copy on the site lives here.

export const profile = {
  name: 'Shivang Patel',
  firstName: 'Shivang',
  role: 'Software Engineer',
  headline:
    'Software Engineer passionate about building scalable applications and applying machine learning to real-world problems.',
  tagline: 'Full-stack developer passionate about creating amazing web experiences.',
  location: 'Austin, TX',
  photo: '/images/profile.webp',
  email: 'shivang.patel1141@gmail.com',
  phone: '+1 (857) 264-9108',
  phoneHref: 'tel:+18572649108',
  github: 'https://github.com/shivang1141',
  linkedin: 'https://www.linkedin.com/in/shivangpatel-uml/',
  repo: 'https://github.com/shivang1141/personal-website',
};

export const about = {
  origins:
    'My interest in technology started in high school with a programming class, sparking a passion for problem-solving that led me to study Computer Science at UMass Lowell and pursue a Master’s in Artificial Intelligence at UT Austin.',
  philosophy:
    'I approach every project with a focus on clarity, scalability, and impact. I believe great software is intuitive, maintainable, and built to last. I write clean, modular code, design user-first interfaces, and continually learn new technologies to create meaningful, high-performance experiences.',
};

export const stats = [
  { value: '20+', label: 'Projects' },
  { value: '5+', label: 'Years coding' },
  { value: '500+', label: 'Energy drinks downed' },
];

export const education = [
  {
    school: 'The University of Texas at Austin',
    short: 'UT Austin',
    degree: 'Master of Science in Artificial Intelligence',
    date: 'Expected Dec 2026',
    location: 'Austin, TX',
    monogram: 'UT',
    color: '#bf5700',
  },
  {
    school: 'University of Massachusetts Lowell',
    short: 'UMass Lowell',
    degree: 'Bachelor of Science in Computer Science',
    minor: 'Minor in Mathematics',
    date: 'Dec 2022',
    location: 'Lowell, MA',
    monogram: 'UML',
    color: '#0067b1',
  },
];

export const experience = [
  {
    title: 'Full Stack Software Engineer Co-op',
    company: 'Crop One Holdings',
    monogram: 'C1',
    location: 'Boston, MA',
    period: 'Apr 2022 – 2023',
    description:
      'Developed and maintained full-stack features using Python and Vue.js for a farm management platform, allowing teams to track harvests and manage inventory more efficiently.',
    achievements: [
      'Built a computer vision tool with OpenCV and Python that automated plant growth measurements, significantly reducing time spent on manual data collection for researchers.',
      'Set up and maintained Jenkins CI/CD pipelines with Docker, improving the deployment process and reducing the frequency of production bugs.',
      'Worked cross-functionally in an agile team to complete feature requests and fix bugs, collaborating with plant scientists, engineers, and product stakeholders.',
    ],
    technologies: ['Python', 'Vue.js', 'OpenCV', 'Jenkins', 'Docker'],
  },
];

export type SkillCategory = {
  title: string;
  icon: 'frontend' | 'backend' | 'embedded' | 'ml' | 'tools' | 'soft';
  color: string;
  skills: string[];
};

export const skills: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: 'frontend',
    color: '#0a84ff',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue.js', 'Tailwind CSS', 'Motion'],
  },
  {
    title: 'Backend',
    icon: 'backend',
    color: '#30b0c7',
    skills: ['Node.js', 'Express', 'Python', 'Go', 'Flask', 'Django', 'SQL', 'REST APIs', 'Prisma', 'PostgreSQL'],
  },
  {
    title: 'Embedded',
    icon: 'embedded',
    color: '#ff9500',
    skills: ['C', 'C++', 'Assembly', 'MSP430', 'FSM', 'KiCad'],
  },
  {
    title: 'ML / AI',
    icon: 'ml',
    color: '#af52de',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'Pandas', 'NumPy', 'Matplotlib', 'TensorBoard', 'Milvus'],
  },
  {
    title: 'Tools',
    icon: 'tools',
    color: '#8e8e93',
    skills: ['Git', 'GitHub', 'Docker', 'AWS', 'Jenkins', 'CI/CD', 'Linux', 'VS Code', 'Vercel'],
  },
  {
    title: 'Soft Skills',
    icon: 'soft',
    color: '#34c759',
    skills: ['Leadership', 'Teamwork', 'Public Speaking', 'Project Management', 'Problem Solving', 'Adaptability'],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    id: 'semantic-video-search',
    title: 'Semantic Video Search',
    category: 'Machine Learning',
    summary: 'Find any video by describing it in plain English.',
    description:
      'A natural language video retrieval system that lets you search for videos by typing plain English descriptions. Uses the CLIP4CLIP model to encode text and video frames, with Milvus as the vector database for fast similarity search. Achieved 90.8% Recall@10 and 68.0% mAP on the FIRE benchmark using the C4C technique.',
    image: '/images/semantic_video_search_system.webp',
    tags: ['Python', 'CLIP4CLIP', 'Milvus', 'Streamlit', 'OpenCV', 'PyTorch'],
    github: 'https://github.com/shivang1141/semantic_video_search_system',
  },
  {
    id: 'trajectory-planner',
    title: 'Autonomous Vehicle Trajectory Planner',
    category: 'Deep Learning',
    summary: 'MLP, Transformer, and CNN go head to head on the road ahead.',
    description:
      'End-to-end deep learning system for autonomous vehicle trajectory prediction. Implements and compares three neural architectures — MLP, Transformer (Perceiver-style), and CNN — trained on the SuperTuxKart driving dataset to predict future waypoints for vehicle navigation.',
    image: '/images/autonomous_vehicle_trajectory_planner.webp',
    tags: ['Python', 'PyTorch', 'TensorFlow', 'CNN', 'Transformer', 'NumPy'],
    github: 'https://github.com/shivang1141/Autonomous_Vehicle_Trajectory_Planner',
  },
  {
    id: 'lanevision',
    title: 'LaneVision',
    category: 'Computer Vision',
    summary: 'Lane detection for self-driving cars, frame by frame.',
    description:
      'A lane detection system for self-driving cars built with Python and OpenCV. Processes input video by applying grayscale conversion, Gaussian blur, Canny edge detection, ROI masking, and Hough transform to detect and overlay lane lines, outputting an annotated MP4 video.',
    image: '/images/lanevision.webp',
    tags: ['Python', 'OpenCV', 'NumPy', 'Matplotlib', 'MoviePy'],
    github: 'https://github.com/shivang1141/LaneVision',
  },
  {
    id: 'mobile-robot',
    title: 'Mobile Robot',
    category: 'Robotics',
    summary: 'A robot that hunts down balloons by color — and pops them.',
    description:
      'An intelligent ground mobile robot that uses camera vision and digital sensors to autonomously detect and approach user-specified colored balloons for targeted popping. Features a servo motor-operated arm and custom C programming using the KIPR Wombat library for navigation and object detection.',
    image: '/images/mobile_robotics.webp',
    tags: ['C', 'KIPR Wombat', 'Computer Vision', 'Robotics', 'Embedded'],
    github: 'https://github.com/shivang1141/Mobile-robot',
    live: { href: 'https://www.youtube.com/watch?v=LPAp9JfDPcE', label: 'Watch Video' },
  },
  {
    id: 'airbnb-clone',
    title: 'Airbnb Clone',
    category: 'Full Stack',
    summary: 'Search, favorite, and book stays — with OAuth sign-in.',
    description:
      'A full-stack Airbnb clone with user authentication (GitHub & Google OAuth), accommodation search with filters, favorites, reservation management, and property listings. Features a live deployment on Vercel.',
    image: '/images/airbnb_clone.webp',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Tailwind CSS', 'NextAuth'],
    github: 'https://github.com/shivang1141/Airbnb-clone',
    live: { href: 'https://airbnb-clone-one-chi.vercel.app/', label: 'Open Live Site' },
  },
];
