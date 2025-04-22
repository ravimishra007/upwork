import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, Award, Clock, Briefcase, BookOpen, Coffee, Database, Moon, Puzzle, 
  Wrench, ExternalLink, Monitor, Figma, Github, MessageSquare, Edit, Chrome, 
  ChevronDown, ChevronRight, Globe, GraduationCap, Lightbulb, Terminal, 
  Languages, Timer, Sun, Sunrise, Sunset, Repeat, Zap, Calendar, Info,
  FolderOpen, Mail, Package as Workflow
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function About() {
  // Set page title
  useEffect(() => {
    document.title = "About | Stanislav Nikov";
  }, []);
  
  // State for expandable sections
  const [expandedBio, setExpandedBio] = useState(false);
  const [expandedEducation, setExpandedEducation] = useState(false);

  // Skills categorized by type
  const skills = {
    technical: [
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "React/Next.js", level: 85 },
      { name: "WordPress/Plugins", level: 95 },
      { name: "Web/Server/SEO", level: 90 },
      { name: "PHP/MySQL/HTML/CSS", level: 85 },
      { name: "AI/Automation", level: 80 }
    ],
    expertise: [
      "Technical Leadership",
      "System Architecture", 
      "Web Development",
      "Digital Marketing",
      "Content Creation",
      "Process Optimization"
    ],
    languages: [
      { name: "Bulgarian", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "German", level: "Advanced" }
    ],
    certifications: [
      { name: "How to Improve Recruitment Scout Q4 2021", issuer: "ScoutDe" },
      { name: "Google Ads Search Expert Q4 2020", issuer: "Google" },
      { name: "PCAP: Python and Analysis June 2021", issuer: "Python Institute" }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                  Biography
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandedBio(!expandedBio)}
                  className="text-gray-500 hover:text-indigo-500"
                >
                  {expandedBio ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <span className="ml-1 text-xs">{expandedBio ? "Show less" : "Read more"}</span>
                </Button>
              </div>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  I'm Stanislav Margaritov Nikov, born in <a href="https://en.wikipedia.org/wiki/Varna" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Varna, Bulgaria</a>, but raised in <a href="https://en.wikipedia.org/wiki/Sofia" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Sofia</a>. After completing my education, I moved to Germany to explore content creation, automation, and digital solutions for modern living. My journey has been shaped by a deep curiosity about how technology can enhance human experiences while maintaining a connection to traditional values.
                </p>
                
                <p className={!expandedBio ? "line-clamp-2" : ""}>
                  Currently, I work as an AI Researcher at <a href="https://www.geocon.de/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">geocon.de</a>, where I apply my diverse background to develop innovative solutions. I focus on creating systems that are both technically sophisticated and intuitive for users across different cultural backgrounds. When I'm not working, I enjoy writing and cooking – finding creativity in both the digital and culinary worlds, which helps me maintain a balanced perspective on technology and tradition.
                </p>
                
                {expandedBio && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-2 flex items-center">
                          <Globe className="mr-1 h-4 w-4 text-indigo-500" />
                          Geographic Journey
                        </h3>
                        <p className="text-sm">
                          Born on the Black Sea coast, I spent my formative years in Sofia before relocating to Germany, 
                          where I currently reside. This international experience has given me a unique perspective 
                          on technology and communication.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-2 flex items-center">
                          <Lightbulb className="mr-1 h-4 w-4 text-indigo-500" />
                          Philosophy
                        </h3>
                        <p className="text-sm">
                          I believe in creating technology that genuinely enhances human experiences. My approach combines technical excellence with a deep understanding of human needs and behaviors.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-2 flex items-center">
                          <BookOpen className="mr-1 h-4 w-4 text-indigo-500" />
                          Knowledge Focus
                        </h3>
                        <p className="text-sm">
                          My interests lie at the intersection of computational linguistics, AI systems, and human-centered design. I continuously explore emerging technologies that bridge traditional boundaries.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-2 flex items-center">
                          <Briefcase className="mr-1 h-4 w-4 text-indigo-500" />
                          Professional Approach
                        </h3>
                        <p className="text-sm">
                          I emphasize clear communication, iterative improvement, and practical solutions. I believe in building systems that are robust, adaptable, and create genuine value for users.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-indigo-500" />
                    Education
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setExpandedEducation(!expandedEducation)}
                    className="text-gray-500 hover:text-indigo-500"
                  >
                    {expandedEducation ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <span className="ml-1 text-xs">{expandedEducation ? "Show less" : "Details"}</span>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-indigo-500 pl-3 py-1">
                    <a 
                      href="https://www.uni-sofia.bg/eng" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium hover:text-indigo-600 transition-colors flex items-center"
                    >
                      Sofia University
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Linguistics, Bulgaria</p>
                    {expandedEducation && (
                      <p className="text-xs text-gray-500 mt-1">
                        Focus on computational linguistics and natural language processing, with additional studies on cross-cultural communication.
                      </p>
                    )}
                  </div>
                  
                  <div className="border-l-2 border-indigo-500 pl-3 py-1">
                    <a 
                      href="https://elsys-bg.org/en/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium hover:text-indigo-600 transition-colors flex items-center"
                    >
                      ELSYS (Electronic Systems High School)
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Computer Sciences, Sofia</p>
                    {expandedEducation && (
                      <p className="text-xs text-gray-500 mt-1">
                        Specialized in programming, system architecture, and digital systems design. Participated in national coding competitions.
                      </p>
                    )}
                  </div>
                  
                  <div className="border-l-2 border-indigo-500 pl-3 py-1">
                    <a 
                      href="https://smg.bg/en/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium hover:text-indigo-600 transition-colors flex items-center"
                    >
                      Sofia High School of Mathematics
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mathematics</p>
                    {expandedEducation && (
                      <p className="text-xs text-gray-500 mt-1">
                        Advanced curriculum covering calculus, discrete mathematics, and mathematical analysis. Foundation for my analytical thinking approach.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-indigo-500" />
                  Experience
                </h2>
                <div className="space-y-5">
                  <div className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-white shadow rounded-full h-9 w-9 flex items-center justify-center overflow-hidden border border-gray-200">
                        <img src="https://www.geocon.de/wp-content/uploads/2021/09/cropped-geocon_favicon-180x180.png" 
                            alt="Geocon logo" 
                            className="h-7 w-7 object-contain" 
                            onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">AI Researcher</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <a href="https://www.geocon.de/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center">
                            geocon.de, Current <ExternalLink className="h-3 w-3 ml-1 inline" />
                          </a>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-12">Geospatial consulting firm specializing in GIS and visualization</p>
                  </div>
                  
                  <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 shadow rounded-full h-9 w-9 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22v-5l5-5 5 5-5 5z"/><path d="M9.5 14.5L17 7l2 2-7.5 7.5z"/><path d="M17 7l-5-5 5 5z"/></svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Freelance</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Self-employed, Germany</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-12">Creating custom logos, business cards, and print-on-demand designs on Fiverr for clients with ChatGPT, MidJourney, and Canva</p>
                  </div>
                  
                  <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-white shadow rounded-full h-9 w-9 flex items-center justify-center overflow-hidden border border-gray-200">
                        <img src="https://s3.amazonaws.com/cdn.500.com/images/public/plus500-icon.png" 
                            alt="Plus500 logo" 
                            className="h-7 w-7 object-contain" 
                            onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Compliance Associate</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <a href="https://www.plus500.com/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center">
                            Plus500 <ExternalLink className="h-3 w-3 ml-1 inline" />
                          </a>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-12">Online trading platform for CFDs on various financial markets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-full">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Puzzle className="mr-2 h-5 w-5 text-indigo-500" />
                    Things I'm Working On
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Digital Family Infrastructure</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Building secure, resilient digital systems for modern family needs including shared calendars, document storage, and emergency protocols.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Updated Family Values</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Documenting and evolving family principles that balance traditional wisdom with contemporary challenges in the digital age.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Smart Home Solutions</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Implementing privacy-focused home automation that enhances daily living while minimizing dependency on external cloud services.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Smart Phone Customizations</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Creating distraction-free mobile environments with customized launchers and automation to support mindful technology use.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Desktop Customizations</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Developing optimized workspaces and productivity systems that enhance focus and reduce digital friction.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-2">Data Automations</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Creating systems for automatic data collection, processing, and visualization to derive meaningful insights from daily digital interactions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="h-full">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                    Routines
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Coffee className="h-4 w-4 text-amber-500 mr-1.5" />
                        Morning Rituals
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Meditation and exercise for mental clarity, followed by reviewing the day's priorities and checking essential communications before diving into focused work.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Coffee className="h-5 w-5 text-amber-500 mr-2" />
                              Morning Ritual Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My detailed morning ritual includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>Preparing my power-coffee (1 coffee capsule, 2 grams of creatine, 3 grams of glutamine, cocoa powder, sweet root with B6, chaga, reishi, cordyceps, hericium)</li>
                              <li>Doing 5 reps of 5 pull-ups</li>
                              <li>Doing 5 reps of full-body stretches</li>
                              <li>Opening reminders on Android and checking smart home automations</li>
                              <li>Setting priorities for the day using a digital-analog hybrid system</li>
                              <li>Quick morning scan of essential communications</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Zap className="h-4 w-4 text-yellow-500 mr-1.5" />
                        Energy Management
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Strategic breaks throughout the day to maintain focus and creativity. Deep work sessions followed by short recharging periods to sustain productivity for the long term.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                              Energy Management Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My energy management techniques include:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>90-minute focused work blocks followed by 15-20 minute breaks</li>
                              <li>Midday walks outside without technology</li>
                              <li>Short meditation sessions between difficult tasks</li>
                              <li>Batch processing emails and communications to specific time slots</li>
                              <li>Tracking energy levels throughout the day to identify optimal times for different types of work</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 text-blue-500 mr-1.5" />
                        Continuous Learning
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Daily reading and research to stay current with industry developments. Weekly dedicated time for exploring new technologies and approaches that could enhance workflows.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                              Continuous Learning Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My learning methodology includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>30 minutes of daily reading focused on technical topics (programming, AI, web development)</li>
                              <li>Subscription to 5 premium technical newsletters covering new technologies</li>
                              <li>Participation in 2-3 online workshops or webinars per month</li>
                              <li>Maintaining a "learning database" of articles, code snippets, and techniques</li>
                              <li>Weekend deep-dive sessions into one new technology every month</li>
                              <li>Using spaced repetition tools to maintain knowledge of infrequently used technologies</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Moon className="h-4 w-4 text-indigo-500 mr-1.5" />
                        Evening Wind Down
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Technology-free time before bed to allow the mind to process the day's work. Preparation for the next day with clear priorities already established.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                              Evening Wind Down Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My evening routine includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>Setting all devices to Do Not Disturb mode after 8:00 PM</li>
                              <li>Using warm, low-blue light settings on all screens past 7:00 PM</li>
                              <li>Paper-based journaling to reflect on the day's accomplishments</li>
                              <li>Setting up a focused to-do list for the next morning</li>
                              <li>Reading physical books (non-technical) for 30 minutes before sleep</li>
                              <li>Completely technology-free final hour before sleeping</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 text-green-500 mr-1.5" />
                        Weekly Review
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Dedicated time each weekend to review progress, adjust goals, and plan the upcoming week with clear priorities and focus areas.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Calendar className="h-5 w-5 text-green-500 mr-2" />
                              Weekly Review Process
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My weekly review follows a structured process:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>Every Sunday morning - 2 hours of focused review time</li>
                              <li>Tracking completion of weekly goals (quantitative metrics)</li>
                              <li>Evaluating quality of work and personal satisfaction</li>
                              <li>Reviewing productivity data from time-tracking tools</li>
                              <li>Analyzing friction points and areas for workflow improvement</li>
                              <li>Setting 3-5 primary objectives for the upcoming week</li>
                              <li>Breaking objectives into specific daily tasks</li>
                              <li>Preparing calendar slots for focused deep work</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                <div className="h-full">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-indigo-500" />
                    Workflows
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Monitor className="h-4 w-4 text-blue-500 mr-1.5" />
                        Windows Workflow
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Customized workspace with focused desktop applications for rapid task switching and efficient content creation. Automated file management and backup systems.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Monitor className="h-5 w-5 text-blue-500 mr-2" />
                              Windows Workflow Setup
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My Windows workspace includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li><strong>Display configuration:</strong> Dual 27" monitors with vertically-divided workspaces using FancyZones</li>
                              <li><strong>Task management:</strong> Customized PowerToys shortcuts for window positioning</li>
                              <li><strong>File organization:</strong> Structured project folders with Git integration</li>
                              <li><strong>Key applications:</strong> VS Code, PowerShell, Windows Terminal, DevToys</li>
                              <li><strong>Automation:</strong> PowerShell scripts for repetitive tasks like project setup</li>
                              <li><strong>Backup system:</strong> Automated cloud sync and local backups on schedule</li>
                              <li><strong>Search enhancement:</strong> Everything search tool with custom filters</li>
                            </ul>
                            <div className="pt-2">
                              <p className="text-sm font-medium">Windows Key Bindings:</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                <div>Win+1,2,3: Main applications</div>
                                <div>Win+Q: Quick search</div>
                                <div>Win+Shift+S: Screenshot</div>
                                <div>Alt+Space: PowerToys Run</div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Chrome className="h-4 w-4 text-blue-500 mr-1.5" />
                        Google Workflow
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Integrated Google Workspace solutions for collaborative document creation, calendar management, and communication. Enhanced with custom scripts for automation.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Chrome className="h-5 w-5 text-blue-500 mr-2" />
                              Google Workspace Setup
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My Google Workspace setup includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li><strong>Gmail:</strong> Labels and filters for auto-sorting emails into priority categories</li>
                              <li><strong>Calendar:</strong> Color-coded time blocking with automated reminders</li>
                              <li><strong>Drive:</strong> Structured folder hierarchy with client/project-specific organization</li>
                              <li><strong>Docs:</strong> Templates for common document types (proposals, reports, etc.)</li>
                              <li><strong>Sheets:</strong> Custom formulas and scripts for data processing</li>
                              <li><strong>Apps Script:</strong> Custom automations for calendar management and email responses</li>
                              <li><strong>Chrome extensions:</strong> Tab management tools and productivity enhancers</li>
                            </ul>
                            <p className="text-sm font-medium mt-2">Time-saving practices:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>Using keyboard shortcuts extensively (⌘+K for quick navigation)</li>
                              <li>Keeping documents in "offline" mode for travel work</li>
                              <li>Utilizing Google's voice typing for quick note-taking</li>
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 text-green-500 mr-1.5" />
                        ChatGPT Workflow
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Specialized prompting techniques and templates for content creation, code generation, and research assistance. Iterative refinement process for optimal results.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                              My ChatGPT Prompt Framework
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">I use a structured approach to AI prompt engineering:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li><strong>Prompt templates:</strong> Reusable structures for common tasks</li>
                              <li><strong>Chain-of-thought prompting:</strong> Breaking complex problems into logical steps</li>
                              <li><strong>Role prompting:</strong> Setting specific expert personas for specialized tasks</li>
                              <li><strong>Iteration cycles:</strong> Refining outputs through followup prompts</li>
                              <li><strong>Knowledge augmentation:</strong> Providing reference materials to guide responses</li>
                            </ul>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2">
                              <p className="text-xs font-medium mb-1">Sample prompt template:</p>
                              <p className="text-xs">
                                &quot;I want you to act as [expert role]. Analyze [subject] and provide [specific deliverable]. 
                                Use these criteria: [criteria list]. Format the response as [format instructions]. 
                                Include [specific elements] and avoid [what to exclude].&quot;
                              </p>
                            </div>
                            <p className="text-sm">For coding tasks, I use a different template focused on technical specifications, test cases, and edge case handling requirements.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Database className="h-4 w-4 text-purple-500 mr-1.5" />
                        Airtable Workflow
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Complex relational database setups for project management, content planning, and resource tracking. Connected with automation tools for seamless data flow.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 absolute top-3 right-3">
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Database className="h-5 w-5 text-purple-500 mr-2" />
                              Airtable Database Setup
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm">My Airtable system consists of interconnected bases:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li><strong>Project Management Base:</strong> Tracking all client projects with statuses, deadlines, and resource allocations</li>
                              <li><strong>Content Calendar:</strong> Editorial planning with content types, platforms, and publishing schedule</li>
                              <li><strong>Resource Library:</strong> Database of reusable assets, templates, and reference materials</li>
                              <li><strong>Client Database:</strong> Contact management with communication history and project references</li>
                            </ul>
                            <p className="text-sm font-medium mt-2">Automation connections:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>Zapier integrations with Slack for project status updates</li>
                              <li>Calendar sync for deadline management</li>
                              <li>Email notifications for approaching milestones</li>
                              <li>Custom JavaScript automations for complex data processing</li>
                            </ul>
                            <p className="text-sm">The system is structured as a single source of truth for all project information, eliminating duplicate data entry and version control issues.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-indigo-500" />
                Professional Synergies
              </h2>
              <div className="space-y-5">
                <div className="relative p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900">
                  <div className="flex items-center mb-2">
                    <Terminal className="h-4 w-4 text-indigo-600 mr-2" />
                    <h3 className="font-medium text-indigo-700 dark:text-indigo-300">Technology + Creativity</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Combining technical expertise with creative thinking to build innovative solutions that solve real-world problems while providing excellent user experiences.
                  </p>
                </div>
                
                <div className="relative p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-900">
                  <div className="flex items-center mb-2">
                    <Languages className="h-4 w-4 text-violet-600 mr-2" />
                    <h3 className="font-medium text-violet-700 dark:text-violet-300">Linguistics + Programming</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Leveraging my background in linguistics and multiple languages to create better user interfaces, natural-sounding content, and communication systems that resonate across cultures.
                  </p>
                </div>
                
                <div className="relative p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center mb-2">
                    <Globe className="h-4 w-4 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Digital + Analog Balance</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Finding harmony between cutting-edge digital solutions and traditional analog approaches to create balanced, resilient systems. This combination provides both high-tech convenience and practical fallbacks for a more sustainable lifestyle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/25 to-indigo-700/25 text-white shadow-lg border border-purple-400/20">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Workflow className="h-5 w-5 mr-2 text-purple-300" />
                  My Working Style
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-md backdrop-blur-sm">
                    <h4 className="font-medium text-sm mb-2 flex items-center text-purple-200">
                      <Timer className="h-4 w-4 mr-1.5" />
                      Time Management
                    </h4>
                    <p className="text-xs text-purple-100">
                      I use timeboxing techniques with clearly defined objectives for each work session. This creates focus and measurable progress.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-md backdrop-blur-sm">
                    <h4 className="font-medium text-sm mb-2 flex items-center text-purple-200">
                      <MessageSquare className="h-4 w-4 mr-1.5" />
                      Communication
                    </h4>
                    <p className="text-xs text-purple-100">
                      Clear, concise updates with context-appropriate detail. I prefer asynchronous communication for most matters and real-time for complex discussions.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-md backdrop-blur-sm">
                    <h4 className="font-medium text-sm mb-2 flex items-center text-purple-200">
                      <Edit className="h-4 w-4 mr-1.5" />
                      Documentation
                    </h4>
                    <p className="text-xs text-purple-100">
                      Thorough documentation as I work, not as an afterthought. I believe well-organized notes create continuity and efficiency.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-md backdrop-blur-sm">
                    <h4 className="font-medium text-sm mb-2 flex items-center text-purple-200">
                      <Coffee className="h-4 w-4 mr-1.5" />
                      Work Environment
                    </h4>
                    <p className="text-xs text-purple-100">
                      Optimized workspace with multiple screens, ergonomic setup, and customized tools that support quick task switching and sustained focus.
                    </p>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
                  <p className="text-purple-100 mb-2 text-sm">
                    I believe in a structured approach to work that combines focused productivity with deliberate rest periods. My workflow balances independent deep work with collaborative sessions.
                  </p>
                  <p className="text-purple-100 text-sm">
                    My routines are designed to maximize cognitive performance and creative output while maintaining sustainable work habits for long-term effectiveness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-lg bg-gradient-to-br from-teal-500/25 via-cyan-600/25 to-emerald-600/25 text-white shadow-lg border border-teal-400/20">
            <div className="flex items-center mb-3">
              <Code className="h-5 w-5 mr-2 text-teal-200" />
              <h3 className="font-bold text-lg">Need a developer?</h3>
            </div>
            <div className="flex gap-3 justify-between">
              <a 
                href="mailto:thekingofburden@gmail.com"
                className="flex-1 text-center bg-white text-teal-700 px-4 py-2 rounded-md font-medium hover:bg-teal-50 transition-colors flex justify-center items-center"
              >
                <Mail className="h-4 w-4 mr-1.5" />
                Get in touch
              </a>
              <a 
                href="/projects"
                className="flex-1 text-center bg-teal-700/40 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700/60 transition-colors border border-teal-400/30 flex justify-center items-center"
              >
                <FolderOpen className="h-4 w-4 mr-1.5" />
                View projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}