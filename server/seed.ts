import { db, pool } from './db';
import {
  users,
  socialLinks,
  singles,
  albums,
  moviesAndTvSeries,
  books,
  blogPosts,
  readingResources,
  courses,
  galleryItems,
  androidApps,
  windowsApps,
  movies,
  music
} from '@shared/schema';

async function main() {
  console.log('Seeding database...');
  
  try {
    // First clear any existing data
    // Comment these out if you want to keep existing data
    await db.delete(androidApps);
    await db.delete(windowsApps);
    await db.delete(galleryItems);
    await db.delete(courses);
    await db.delete(readingResources);
    await db.delete(blogPosts);
    await db.delete(books);
    await db.delete(moviesAndTvSeries);
    await db.delete(albums);
    await db.delete(singles);
    await db.delete(socialLinks);
    await db.delete(users);
    await db.delete(movies);
    await db.delete(music);
    
    // Add sample user
    const [user] = await db.insert(users).values({
      username: 'stanislavnikov',
      password: 'password123',
      name: 'Stanislav Nikov',
      bio: 'Web developer & graphic designer. Passionate about creative solutions with expertise in HTML, CSS, JavaScript, and modern frameworks.',
      location: 'Germany',
      profileImage: '/profile-photo.jpg'
    }).returning();
    
    console.log('Added user:', user.name);
    
    // Add social links
    const socialLinksData = [
      {
        userId: user.id,
        platform: "facebook",
        name: "Facebook",
        username: "eyedealist",
        url: "https://www.facebook.com/eyedealist",
        active: true,
        order: 0
      },
      {
        userId: user.id,
        platform: "linkedin",
        name: "LinkedIn",
        username: "stanislav-nikov",
        url: "https://www.linkedin.com/in/stanislav-nikov/",
        active: true,
        order: 1
      },
      {
        userId: user.id,
        platform: "twitter",
        name: "Twitter/X",
        username: "@StanislavMNikov",
        url: "https://x.com/StanislavMNikov",
        active: true,
        order: 2
      },
      {
        userId: user.id,
        platform: "instagram",
        name: "Instagram",
        username: "@stansnikov",
        url: "https://www.instagram.com/stansnikov/",
        active: true,
        order: 3
      },
      {
        userId: user.id,
        platform: "youtube",
        name: "YouTube",
        username: "@StanislavNikov",
        url: "https://www.youtube.com/@StanislavNikov",
        active: true,
        order: 4
      },
      {
        userId: user.id,
        platform: "github",
        name: "GitHub",
        username: "StanislavNikov",
        url: "https://github.com/StanislavNikov",
        active: true,
        order: 5
      },
      {
        userId: user.id,
        platform: "pinterest",
        name: "Pinterest",
        username: "StanislavMNikov",
        url: "https://www.pinterest.com/StanislavMNikov/",
        active: true,
        order: 6
      }
    ];
    
    await db.insert(socialLinks).values(socialLinksData);
    console.log('Added social links:', socialLinksData.length);
    
    // Add singles
    const singlesData = [
      {
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        releaseDate: "1965-06-20",
        genre: ["Rock", "Folk Rock"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/96/HighwayRevisited.jpg",
        spotifyUrl: "https://open.spotify.com/track/3AhXZa8sUQht0UEdBJgpGc",
        appleMusicUrl: "https://music.apple.com/us/album/like-a-rolling-stone/201281514?i=201281516",
        youtubeUrl: "https://www.youtube.com/watch?v=IwOfCgkyEj0",
        description: "Bob Dylan's groundbreaking single that changed rock music forever.",
        featured: true
      },
      {
        title: "Imagine",
        artist: "John Lennon",
        releaseDate: "1971-10-11",
        genre: ["Rock", "Pop"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/69/ImagineCover.jpg",
        spotifyUrl: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9",
        appleMusicUrl: "https://music.apple.com/us/album/imagine/1440857781?i=1440857789",
        youtubeUrl: "https://www.youtube.com/watch?v=YkgkThdzX-8",
        description: "John Lennon's iconic peace anthem.",
        featured: true
      },
      {
        title: "What's Going On",
        artist: "Marvin Gaye",
        releaseDate: "1971-01-20",
        genre: ["Soul", "R&B"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/83/What%27s_Going_On_%28Marvin_Gaye_album%29_CD_cover.jpg",
        spotifyUrl: "https://open.spotify.com/track/3Um9toULmYFGCpvaIPFxup",
        appleMusicUrl: "https://music.apple.com/us/album/whats-going-on/1440785372?i=1440785645",
        youtubeUrl: "https://www.youtube.com/watch?v=H-kA3UtBj4M",
        description: "Marvin Gaye's soulful reflection on social issues.",
        featured: false
      }
    ];
    
    await db.insert(singles).values(singlesData);
    console.log('Added singles:', singlesData.length);
    
    // Add albums
    const albumsData = [
      {
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        releaseDate: "1973-03-01",
        genre: ["Progressive Rock", "Psychedelic Rock"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        spotifyUrl: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv",
        appleMusicUrl: "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699",
        description: "Pink Floyd's iconic concept album exploring themes of conflict, greed, time, and mental illness.",
        featured: true,
        tracklist: ["Speak to Me", "Breathe (In the Air)", "On the Run", "Time", "The Great Gig in the Sky", "Money", "Us and Them", "Any Colour You Like", "Brain Damage", "Eclipse"]
      },
      {
        title: "Thriller",
        artist: "Michael Jackson",
        releaseDate: "1982-11-30",
        genre: ["Pop", "R&B", "Funk"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
        spotifyUrl: "https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ",
        appleMusicUrl: "https://music.apple.com/us/album/thriller/269572838",
        description: "Michael Jackson's best-selling album that revolutionized pop music and music videos.",
        featured: true,
        tracklist: ["Wanna Be Startin' Somethin'", "Baby Be Mine", "The Girl Is Mine", "Thriller", "Beat It", "Billie Jean", "Human Nature", "P.Y.T. (Pretty Young Thing)", "The Lady in My Life"]
      }
    ];
    
    await db.insert(albums).values(albumsData);
    console.log('Added albums:', albumsData.length);
    
    // Add movies and TV series
    const moviesAndTvData = [
      {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        releaseDate: "1994-09-23",
        genre: ["Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        type: "movie",
        seasons: null,
        netflixUrl: "https://www.netflix.com/title/70005379",
        amazonUrl: "https://www.amazon.com/Shawshank-Redemption-Tim-Robbins/dp/B001CIOCLC",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        featured: true,
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
      },
      {
        title: "Breaking Bad",
        director: "Vince Gilligan",
        releaseDate: "2008-01-20",
        genre: ["Drama", "Crime", "Thriller"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
        type: "tvSeries",
        seasons: 5,
        netflixUrl: "https://www.netflix.com/title/70143836",
        amazonUrl: null,
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
        featured: true,
        cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"]
      }
    ];
    
    await db.insert(moviesAndTvSeries).values(moviesAndTvData);
    console.log('Added movies and TV series:', moviesAndTvData.length);
    
    // Add books
    const booksData = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publishDate: "1960-07-11",
        genre: ["Southern Gothic", "Bildungsroman"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/Kill-Mockingbird-Harper-Lee/dp/0060935464",
        goodreadsUrl: "https://www.goodreads.com/book/show/2657.To_Kill_a_Mockingbird",
        description: "The story of young Scout Finch and her father Atticus, a lawyer who defends a black man accused of raping a white woman in the Deep South of the 1930s.",
        featured: true,
        isbn: "978-0-06-112008-4"
      },
      {
        title: "1984",
        author: "George Orwell",
        publishDate: "1949-06-08",
        genre: ["Dystopian", "Political Fiction"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/1984-Signet-Classics-George-Orwell/dp/0451524934",
        goodreadsUrl: "https://www.goodreads.com/book/show/40961427-1984",
        description: "A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors.",
        featured: true,
        isbn: "978-0-452-28423-4"
      }
    ];
    
    await db.insert(books).values(booksData);
    console.log('Added books:', booksData.length);
    
    // Add blog posts
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const blogPostsData = [
      {
        title: "Getting Started with React Hooks",
        excerpt: "Learn the basics of React Hooks and how they've changed the way we write components.",
        content: "In this article, we'll explore the basics of React Hooks and how they've changed the way we write React components. Hooks are a relatively new addition to React (introduced in version 16.8) that allow you to use state and other React features without writing a class.",
        publishDate: twoWeeksAgo,
        lastUpdated: oneWeekAgo,
        author: "Stanislav Nikov",
        category: "Web Development",
        tags: ["react", "hooks", "javascript", "frontend"],
        imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "10 minutes",
        featured: true,
        status: "published"
      },
      {
        title: "Building a Real-time Chat Application with WebSockets",
        excerpt: "Learn how to create a responsive chat app using WebSockets and Node.js.",
        content: "Learn how to create a real-time chat application using WebSockets with Node.js and Express. In this tutorial, we'll build a simple chat application that allows users to send and receive messages instantly.",
        publishDate: oneWeekAgo,
        lastUpdated: now,
        author: "Stanislav Nikov",
        category: "Web Development",
        tags: ["websockets", "nodejs", "express", "realtime"],
        imageUrl: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "15 minutes",
        featured: true,
        status: "published"
      },
      {
        title: "Building Responsive Layouts with CSS Grid",
        excerpt: "Learn how to create complex, responsive layouts using CSS Grid, the powerful two-dimensional layout system that makes designing web layouts more intuitive.",
        content: "CSS Grid Layout is a two-dimensional layout system designed specifically for laying out items on a webpage. It allows you to create complex layouts with ease, without having to rely on older methods like floats or positioning. To use CSS Grid, you first need to set the display property of a container element to 'grid'. This creates a grid where each column is at least 250px wide, and as many columns as can fit will be created. As the screen size changes, the number of columns will automatically adjust.",
        publishDate: twoWeeksAgo,
        lastUpdated: oneWeekAgo,
        author: "Stanislav Nikov",
        category: "CSS",
        tags: ["CSS", "Web Design", "Responsive"],
        imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "5 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Getting Started with TypeScript in 2023",
        excerpt: "TypeScript continues to grow in popularity. This guide walks through setting up a modern TypeScript development environment and key concepts to know.",
        content: "TypeScript is a superset of JavaScript that adds static typing to the language. It was developed by Microsoft and has gained widespread adoption in the web development community. There are several benefits to using TypeScript: catch errors during development instead of at runtime, better IDE support with autocompletion and refactoring tools, improved code readability and maintainability, and better documentation of your code.",
        publishDate: new Date("2023-03-28"),
        lastUpdated: new Date("2023-04-15"),
        author: "Stanislav Nikov",
        category: "TypeScript",
        tags: ["TypeScript", "JavaScript", "Development"],
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "8 min read",
        featured: true,
        status: "published"
      },
      {
        title: "The Future of React: What's Coming in React 19",
        excerpt: "React 19 is on the horizon with exciting new features. Let's explore what's changing and how it will impact the way we build React applications.",
        content: "React has come a long way since its initial release in 2013. With each major version, it has introduced new features and improvements that have changed how we build web applications. React 19 brings server components to the forefront with improved performance and ease of use. Server Components allow parts of your application to render on the server, reducing the JavaScript sent to the client and improving load times.",
        publishDate: new Date("2023-03-15"),
        lastUpdated: new Date("2023-03-20"),
        author: "Stanislav Nikov",
        category: "React",
        tags: ["React", "JavaScript", "Frontend"],
        imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "6 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Build a Full-Stack App with the MERN Stack",
        excerpt: "Follow along as we build a complete web application using MongoDB, Express, React, and Node.js, with authentication and data management.",
        content: "The MERN stack consists of MongoDB, Express, React, and Node.js. It's a popular stack for building full-stack JavaScript applications. In this tutorial, we'll walk through creating a complete web application with user authentication, data management, and a responsive UI. We'll cover setting up the MongoDB database, creating a RESTful API with Express, building the React frontend, and deploying the application.",
        publishDate: new Date("2023-02-28"),
        lastUpdated: new Date("2023-03-10"),
        author: "Stanislav Nikov",
        category: "JavaScript",
        tags: ["MERN", "Full-Stack", "Tutorial"],
        imageUrl: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "12 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Advanced Node.js Design Patterns",
        excerpt: "Explore advanced design patterns in Node.js applications, including modular architecture, dependency injection, and event-driven programming.",
        content: "Design patterns are reusable solutions to common problems in software design. In Node.js, understanding and implementing the right design patterns can lead to more maintainable, scalable, and resilient applications. This article covers modular architecture, dependency injection, and event-driven programming patterns in Node.js. We'll look at real-world examples and best practices for implementing these patterns in your applications.",
        publishDate: new Date("2023-02-15"),
        lastUpdated: new Date("2023-02-20"),
        author: "Stanislav Nikov",
        category: "Node.js",
        tags: ["Node.js", "JavaScript", "Backend"],
        imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "7 min read",
        featured: true,
        status: "published"
      },
      {
        title: "UI Design Principles for Developers",
        excerpt: "A guide to essential UI design principles that every developer should know to create better user interfaces and improve the user experience.",
        content: "As a developer, understanding UI design principles can help you create more user-friendly applications and collaborate more effectively with designers. This article covers key UI design principles including consistency, visual hierarchy, feedback, and accessibility. We'll look at practical examples and tips for implementing these principles in your web applications.",
        publishDate: new Date("2023-01-28"),
        lastUpdated: new Date("2023-02-05"),
        author: "Stanislav Nikov",
        category: "Design",
        tags: ["UI", "Design", "Frontend"],
        imageUrl: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "6 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Mastering CSS Animation Techniques",
        excerpt: "Take your web interfaces to the next level with advanced CSS animations. Learn keyframes, transitions, and performance optimizations.",
        content: "CSS animations allow you to create dynamic and engaging user interfaces without JavaScript. There are two main types of CSS animations: transitions for simple animations between two states, and keyframe animations for complex animations with multiple states. This article covers both types, along with performance optimization techniques to ensure smooth animations on all devices.",
        publishDate: new Date("2023-01-15"),
        lastUpdated: new Date("2023-01-20"),
        author: "Stanislav Nikov",
        category: "CSS",
        tags: ["CSS", "Animation", "Frontend"],
        imageUrl: "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "9 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Web Accessibility Best Practices",
        excerpt: "Making your websites accessible isn't just nice to have—it's essential. Learn how to build inclusive web applications that everyone can use.",
        content: "Web accessibility ensures that people with disabilities can perceive, understand, navigate, and interact with websites. It's not just a nice-to-have feature—it's often a legal requirement and simply the right thing to do. This article covers accessibility best practices including semantic HTML, alternative text for images, keyboard navigation, color contrast, and accessible forms. We'll also look at tools and techniques for testing accessibility.",
        publishDate: new Date("2023-01-10"),
        lastUpdated: new Date("2023-01-15"),
        author: "Stanislav Nikov",
        category: "Web Design",
        tags: ["Accessibility", "HTML", "Web Standards"],
        imageUrl: "https://images.unsplash.com/photo-1584697964355-07bd29fa7b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "7 min read",
        featured: true,
        status: "published"
      },
      {
        title: "Advanced State Management Patterns in React Applications",
        excerpt: "Explore advanced patterns for managing complex state in large-scale React applications, including context optimization, custom hooks, and integrating with state libraries.",
        content: "React provides useState and useReducer hooks for managing state, but as applications grow more complex, you might need more sophisticated patterns. This article explores advanced state management patterns including context optimization techniques like context splitting and memoization, extracting complex state logic into custom hooks, and integrating with state management libraries like Redux, Zustand, or Jotai.",
        publishDate: new Date("2023-04-01"),
        lastUpdated: new Date("2023-04-05"),
        author: "Stanislav Nikov",
        category: "React",
        tags: ["React", "State Management", "Advanced"],
        imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        readTime: "10 min read",
        featured: true,
        status: "published"
      }
    ];
    
    await db.insert(blogPosts).values(blogPostsData);
    console.log('Added blog posts:', blogPostsData.length);
    
    // Add reading resources
    const readingResourcesData = [
      {
        title: "Modern JavaScript Explained For Dinosaurs",
        url: "https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70",
        type: "article",
        author: "Peter Jang",
        publishDate: "2017-10-05",
        imageUrl: "https://miro.medium.com/max/1400/1*H6NN_RxZNeVyLYpCirsslg.png",
        description: "A comprehensive overview of the modern JavaScript ecosystem and how it evolved over time.",
        category: "Web Development",
        tags: ["JavaScript", "Web Development", "Programming"],
        featured: true
      },
      {
        title: "You Don't Know JS",
        url: "https://github.com/getify/You-Dont-Know-JS",
        type: "book series",
        author: "Kyle Simpson",
        publishDate: "2015-03-10",
        imageUrl: "https://github.com/getify/You-Dont-Know-JS/raw/1st-ed/up%20%26%20going/cover.jpg",
        description: "A series of books diving deep into the core mechanisms of the JavaScript language.",
        category: "Programming",
        tags: ["JavaScript", "Programming", "Deep Dive"],
        featured: true
      }
    ];
    
    await db.insert(readingResources).values(readingResourcesData);
    console.log('Added reading resources:', readingResourcesData.length);
    
    // Add courses
    const coursesData = [
      {
        title: "The Complete Web Developer in 2023",
        provider: "Udemy",
        url: "https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/",
        instructors: ["Andrei Neagoie"],
        level: "Beginner",
        durationHours: 36,
        imageUrl: "https://img-c.udemycdn.com/course/480x270/1430746_2f43_10.jpg",
        description: "Learn to code and become a web developer in 2023 with HTML, CSS, JavaScript, React, Node.js, Machine Learning & more.",
        category: "Web Development",
        tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        featured: true,
        price: "$19.99",
        rating: 5
      },
      {
        title: "CS50: Introduction to Computer Science",
        provider: "edX",
        url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
        instructors: ["David J. Malan"],
        level: "Beginner",
        durationHours: 100,
        imageUrl: "https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d6d3-282e5dcacd9b.small.jpg",
        description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
        category: "Computer Science",
        tags: ["Computer Science", "Programming", "C", "Python", "SQL"],
        featured: true,
        price: "Free",
        rating: 5
      }
    ];
    
    await db.insert(courses).values(coursesData);
    console.log('Added courses:', coursesData.length);
    
    // Add gallery items
    const galleryItemsData = [
      {
        title: "Modern Dashboard UI",
        category: "UI Design",
        description: "A clean and modern dashboard interface with data visualization elements.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["dashboard", "data visualization", "admin panel"],
        year: "2023",
        client: "Financial Tech Startup",
        projectUrl: "https://example.com/projects/dashboard",
        featured: true
      },
      {
        title: "E-commerce Mobile App",
        category: "Mobile Design",
        description: "A comprehensive e-commerce mobile app design with a focus on user experience and conversion.",
        imageUrl: "https://images.unsplash.com/photo-1616499615405-8e6736a19a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["mobile", "e-commerce", "ios", "android"],
        year: "2022",
        client: "Retail Company",
        projectUrl: "https://example.com/projects/ecommerce-app",
        featured: true
      },
      {
        title: "Brand Identity Design",
        category: "Branding",
        description: "Complete brand identity package for a sustainable fashion startup.",
        imageUrl: "https://images.unsplash.com/photo-1634586803899-6d0c7a469ac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["logo", "identity", "branding", "visual design"],
        year: "2023",
        client: "Eco Fashion Brand",
        projectUrl: "https://example.com/projects/eco-brand",
        featured: false
      },
      {
        title: "Photography Portfolio",
        category: "Web Design",
        description: "A photography portfolio website with a minimal aesthetic and fullscreen galleries.",
        imageUrl: "https://images.unsplash.com/photo-1519211975560-4ca611f5a72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["portfolio", "photography", "gallery"],
        year: "2023",
        client: "Professional Photographer",
        projectUrl: "https://example.com/projects/photo-portfolio",
        featured: true
      },
      {
        title: "Icon Set Design",
        category: "Illustration",
        description: "Custom icon set created for a finance management platform.",
        imageUrl: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["icons", "illustration", "finance"],
        year: "2022",
        client: "FinTech Company",
        projectUrl: "https://example.com/projects/icon-set",
        featured: false
      },
      {
        title: "E-commerce Redesign",
        category: "Web Design",
        description: "A complete redesign of an e-commerce platform with a focus on the user journey.",
        imageUrl: "https://images.unsplash.com/photo-1616499615405-8e6736a19a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["e-commerce", "ux design", "redesign"],
        year: "2022",
        client: "Online Retailer",
        projectUrl: "https://example.com/projects/ecommerce-redesign",
        featured: false
      },
      {
        title: "Digital Artwork",
        category: "Illustration",
        description: "Digital art piece created as part of a series exploring geometric abstractions.",
        imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["digital art", "abstract", "geometry"],
        year: "2023",
        client: "Art Exhibition",
        projectUrl: "https://example.com/projects/digital-art",
        featured: true
      },
      {
        title: "Logo Collection",
        category: "Branding",
        description: "A collection of logo designs created for various clients across different industries.",
        imageUrl: "https://images.unsplash.com/photo-1640033489916-4539333a1967?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["logo", "branding", "collection"],
        year: "2023",
        client: "Various Clients",
        projectUrl: "https://example.com/projects/logo-collection",
        featured: false
      },
      {
        title: "Mobile Banking App",
        category: "Mobile Design",
        description: "A user-friendly banking application designed for a modern financial institution.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["banking", "mobile", "fintech"],
        year: "2023",
        client: "Banking Corporation",
        projectUrl: "https://example.com/projects/banking-app",
        featured: true
      },
      {
        title: "Corporate Website",
        category: "Web Design",
        description: "Professional corporate website designed for a global consulting firm.",
        imageUrl: "https://images.unsplash.com/photo-1539158026586-35f9e90dd049?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tags: ["corporate", "business", "responsive"],
        year: "2022",
        client: "Global Consulting",
        projectUrl: "https://example.com/projects/corporate-site",
        featured: false
      }
    ];
    
    await db.insert(galleryItems).values(galleryItemsData);
    console.log('Added gallery items:', galleryItemsData.length);
    
    // Add Android apps
    const androidAppsData = [
      {
        name: "Todoist: To-Do List & Tasks",
        developer: "Doist",
        category: "Productivity",
        rating: 5,
        description: "Organize work and life with Todoist, the to do list and task manager that helps millions stay organized and calm.",
        price: "Free (with in-app purchases)",
        imageUrl: "https://play-lh.googleusercontent.com/TToSS1manSlNLRiLaR9Uz0VZfnKYJGzA0j0qO6jJERXpJdEYjFQVmMavMRefvXYA7Po=s256-rw",
        tags: ["Productivity", "To-Do List", "Task Manager"],
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.todoist",
        amazonAppStoreUrl: null,
        featured: true
      },
      {
        name: "Spotify: Music and Podcasts",
        developer: "Spotify AB",
        category: "Music & Audio",
        rating: 4,
        description: "Listen to songs, play podcasts, create playlists, and discover music you'll love.",
        price: "Free (with in-app purchases)",
        imageUrl: "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qRRlyZhAIxE6sSjZpTRHM4mOAOEj3k2OFlWCRk=s256-rw",
        tags: ["Music", "Audio", "Podcasts", "Streaming"],
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
        amazonAppStoreUrl: "https://www.amazon.com/Spotify-AB-Music/dp/B009NZEP0O",
        featured: true
      }
    ];
    
    await db.insert(androidApps).values(androidAppsData);
    console.log('Added Android apps:', androidAppsData.length);
    
    // Add Windows apps
    const windowsAppsData = [
      {
        name: "Visual Studio Code",
        developer: "Microsoft",
        category: "Development Tools",
        rating: 5,
        description: "Visual Studio Code is a lightweight but powerful source code editor that runs on your desktop.",
        price: "Free",
        imageUrl: "https://code.visualstudio.com/assets/images/code-stable.png",
        tags: ["Code Editor", "Development", "Programming"],
        microsoftStoreUrl: "https://apps.microsoft.com/store/detail/visual-studio-code/XP9KHM4BK9FZ7Q",
        developerWebsiteUrl: "https://code.visualstudio.com/",
        featured: true
      },
      {
        name: "Adobe Photoshop",
        developer: "Adobe Inc.",
        category: "Graphics & Design",
        rating: 4,
        description: "The world's best imaging and graphic design software for creating, enhancing, and editing images, art, and designs.",
        price: "$20.99/month",
        imageUrl: "https://www.adobe.com/content/dam/cc/icons/photoshop.svg",
        tags: ["Photo Editing", "Design", "Graphics"],
        microsoftStoreUrl: "https://apps.microsoft.com/store/detail/adobe-photoshop/9NBLGGH516SZ",
        developerWebsiteUrl: "https://www.adobe.com/products/photoshop.html",
        featured: true
      }
    ];
    
    await db.insert(windowsApps).values(windowsAppsData);
    console.log('Added Windows apps:', windowsAppsData.length);
    
    // Add movies to the original movies table
    const moviesData = [
      {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        year: "1994",
        genre: ["Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        year: "1972",
        genre: ["Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Dark Knight",
        director: "Christopher Nolan",
        year: "2008",
        genre: ["Action", "Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        year: "1994",
        genre: ["Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Pride and Prejudice",
        director: "Jane Austen",
        year: "1813",
        genre: ["Romance", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "To Kill a Mockingbird",
        director: "Harper Lee",
        year: "1960",
        genre: ["Drama", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      }
    ];
    
    await db.insert(movies).values(moviesData);
    console.log('Added movies to original table:', moviesData.length);
    
    // Add music to the original music table
    const musicData = [
      {
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        year: "1965",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/96/HighwayRevisited.jpg",
        type: "song"
      },
      {
        title: "Imagine",
        artist: "John Lennon",
        year: "1971",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/John_Lennon_Imagine.jpg",
        type: "song"
      },
      {
        title: "Thriller",
        artist: "Michael Jackson",
        year: "1982",
        genre: "Pop",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Michael_Jackson_-_Thriller.png/220px-Michael_Jackson_-_Thriller.png",
        type: "album"
      },
      {
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        year: "1973",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        type: "album"
      },
      {
        title: "Abbey Road",
        artist: "The Beatles",
        year: "1969",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        type: "album"
      }
    ];
    
    await db.insert(music).values(musicData);
    console.log('Added music to original table:', musicData.length);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error during seeding:', err);
  process.exit(1);
}); 