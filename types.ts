export enum LaneId {
    LightEasy = 'light_easy',
    ThoughtfulCalm = 'thoughtful_calm',
    PlayfulSafe = 'playful_safe'
}

export interface LaneConfig {
    id: LaneId;
    title: string;
    description: string;
    color: string;
    accentColor: string;
    icon: string;
    theme: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'partner';
    timestamp: Date;
}

export interface GuidanceResponse {
    type: 'opening' | 'follow_up' | 'reassurance' | 'none';
    chips?: string[];
    tone?: 'supportive' | 'neutral';
    reassuranceText?: string; 
}

export interface Match {
    id: string;
    name: string;
    age: number;
    avatar: string;
    job: string;
    location: string;
    bio: string;
    interests: string[];
    isOnline: boolean;
    photos?: string[];
}

export interface UserProfile {
    name: string;
    age: number;
    avatar: string;
    bio: string;
    job: string;
    location: string;
    interests: string[];
}

export const LANES: Record<LaneId, LaneConfig> = {
    [LaneId.LightEasy]: {
        id: LaneId.LightEasy,
        title: 'Light & Easy',
        description: 'Low pressure, casual icebreakers to get the ball rolling.',
        color: 'text-[#93c8a5]',
        accentColor: 'border-[#93c8a5]',
        icon: 'filter_drama',
        theme: 'Soft Blue/Green'
    },
    [LaneId.ThoughtfulCalm]: {
        id: LaneId.ThoughtfulCalm,
        title: 'Thoughtful & Calm',
        description: 'Deeper questions for a meaningful connection.',
        color: 'text-[#b19cd9]',
        accentColor: 'border-[#b19cd9]',
        icon: 'self_improvement',
        theme: 'Lavender'
    },
    [LaneId.PlayfulSafe]: {
        id: LaneId.PlayfulSafe,
        title: 'Playful but Safe',
        description: 'Fun prompts and games with clear boundaries.',
        color: 'text-[#f8ad9d]',
        accentColor: 'border-[#f8ad9d]',
        icon: 'celebration',
        theme: 'Warm Peach'
    }
};

export const MOCK_USER: UserProfile = {
    name: "Alex",
    age: 25,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop",
    bio: "Introvert trying to be an extrovert. Love coding, late night drives, and spicy food.",
    job: "Software Engineer",
    location: "HSR Layout, Bangalore",
    interests: ["Coding", "Night Drives", "Spicy Food", "Gaming"]
};

export const MOCK_MATCHES: Match[] = [
    {
        id: '1',
        name: 'Priya',
        age: 24,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG-_YWExMYJb_8d349wEMXpZZpAKfVJEkO1HUOO8_ST0Kw2f502I205BixBytfGC-kqy6GdzLosVIPV-oh5yOaMC5BPjLpYCzd87HPS_2jhwmFBw3S6VmLb8AwBDjPorUJB9WajwQVi9vFnSs4BSF92GQtikngR1PbLSoqLMAAPUkzuWLZB3-8lbg01tzaDRmFa72OQf2dbRQPHQg-1V6Q96p1_Ny7POb3G7jprEFxJT0e8wv2RjNTjeYrlgjTDo5W7tLVL5j95blw",
        job: "UX Designer",
        location: "Indiranagar, Bangalore",
        bio: "Coffee snob by day, indie music lover by night. Always looking for the next best gig in the city.",
        interests: ["Indie Folk", "Sci-Fi Books", "Filter Coffee", "Cubbon Park"],
        isOnline: true,
        photos: [
            "https://images.unsplash.com/photo-1485230946086-1d99d543166d?q=80&w=3300&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=3270&auto=format&fit=crop"
        ]
    },
    {
        id: '2',
        name: 'Arjun',
        age: 26,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop",
        job: "Product Manager",
        location: "Koramangala, Bangalore",
        bio: "Weekend hiker and craft beer enthusiast. Let's find the best dosa in town.",
        interests: ["Hiking", "Craft Beer", "Tech", "Dosa"],
        isOnline: false,
        photos: [
             "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop"
        ]
    },
     {
        id: '3',
        name: 'Riya',
        age: 23,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3388&auto=format&fit=crop",
        job: "Content Creator",
        location: "Whitefield, Bangalore",
        bio: "Always capturing moments. Love travel and spicy food.",
        interests: ["Photography", "Travel", "Foodie", "Instagram"],
        isOnline: true
    }
];

export const MOCK_EXPLORE_PROFILES: Match[] = [
    {
        id: '4',
        name: 'Sneha',
        age: 24,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3276&auto=format&fit=crop",
        job: "Architect",
        location: "Jayanagar, Bangalore",
        bio: "Designing spaces and dreaming of places. I love exploring heritage structures in the city, sketching in Cubbon Park on Sunday mornings, and hunting for the perfect masala dosa. Looking for someone who appreciates art and good conversation.",
        interests: ["Architecture", "Art", "Museums", "Sketching"],
        isOnline: true,
        photos: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=3271&auto=format&fit=crop"
        ]
    },
    {
        id: '5',
        name: 'Vikram',
        age: 27,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop",
        job: "Chef",
        location: "MG Road, Bangalore",
        bio: "I express myself through food. Running a small bistro and always experimenting with new flavors. Looking for a taste-tester and adventure buddy.",
        interests: ["Cooking", "Food History", "Jazz", "Cycling"],
        isOnline: false,
        photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop"
        ]
    },
    {
        id: '6',
        name: 'Ananya',
        age: 25,
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=3387&auto=format&fit=crop",
        job: "Yoga Instructor",
        location: "Indiranagar, Bangalore",
        bio: "Finding balance in chaos. I teach Vinyasa yoga and love starting my days with a sunrise run. Big believer in mindfulness and good coffee.",
        interests: ["Yoga", "Running", "Meditation", "Healthy Eating"],
        isOnline: true,
        photos: [
             "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3387&auto=format&fit=crop"
        ]
    }
];

// Re-export specific consts for backward compat if needed, but we will mostly use Match objects now.
export const MOCK_PARTNER_NAME = MOCK_MATCHES[0].name;
export const MOCK_PARTNER_AGE = MOCK_MATCHES[0].age;
export const MOCK_PARTNER_AVATAR = MOCK_MATCHES[0].avatar;
export const MOCK_SHARED_INTERESTS = MOCK_MATCHES[0].interests;
export const MOCK_PARTNER_JOB = MOCK_MATCHES[0].job;
export const MOCK_PARTNER_LOCATION = MOCK_MATCHES[0].location;
export const MOCK_PARTNER_BIO = MOCK_MATCHES[0].bio;