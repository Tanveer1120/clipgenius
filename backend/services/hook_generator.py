import random
from typing import List, Dict, Any

HOOK_CATEGORIES = [
    "Curiosity", "Shocking", "Funny", "Emotional",
    "Suspense", "Gaming", "Storytelling", "Mystery",
    "Question", "Unexpected", "Motivational", "Podcast"
]

HOOK_TEMPLATES = {
    "Curiosity": [
        "Wait until you see what happens next...",
        "Nobody was prepared for this twist!",
        "Watch closely or you'll miss the best part!",
        "The reason behind this will surprise you...",
        "What happens in 5 seconds changed everything!"
    ],
    "Shocking": [
        "This completely blew my mind!",
        "The ending is absolutely INSANE!",
        "I still can't believe this actually happened!",
        "You won't believe what they just did!",
        "My jaw literally dropped at this moment!"
    ],
    "Funny": [
        "I was NOT expecting him to say that! 😂",
        "This is the funniest moment of the whole stream!",
        "Try not to laugh at this reaction...",
        "Bro really thought he could get away with this! 💀",
        "The comic timing here is pure perfection!"
    ],
    "Emotional": [
        "This hit right in the feels...",
        "A moment you will never forget.",
        "When words speak straight to the heart...",
        "This gave me goosebumps all over.",
        "The most powerful thing you'll hear today."
    ],
    "Suspense": [
        "Everything was on the line right here...",
        "The tension in this room was crazy!",
        "Seconds away from total disaster...",
        "Will he make it or fail completely?",
        "Do not blink right now..."
    ],
    "Gaming": [
        "The cleanest clutch in gaming history!",
        "Is this the luckiest shot ever pulled off?!",
        "Wait for the unbelievable 1v4 play...",
        "GTA 6 physics just broke the internet!",
        "The lobby had NO idea what was coming!"
    ],
    "Storytelling": [
        "Let me tell you why this changed everything...",
        "It started like any other day, until this...",
        "The story behind this clip will shock you.",
        "Here is what they never showed you...",
        "This one decision altered history forever."
    ],
    "Mystery": [
        "Something weird happened at this exact second...",
        "Can you spot what's wrong with this video?",
        "The unsolved mystery nobody talks about...",
        "Pay attention to the background...",
        "Why does nobody talk about this detail?"
    ],
    "Question": [
        "Would you have done the exact same thing?",
        "Did you know this was even possible?!",
        "Is this the craziest thing ever caught on camera?",
        "What would you do in this exact situation?",
        "How did nobody notice this until now?"
    ],
    "Unexpected": [
        "Nobody saw this coming from a mile away!",
        "I expected everything except THAT!",
        "Plot twist of the century right here!",
        "It went from 0 to 100 in 2 seconds!",
        "When you expect one thing and get this..."
    ],
    "Motivational": [
        "Remember this every single morning.",
        "The mindset that separates the 1% from the rest.",
        "If you need a sign to keep going, this is it.",
        "Stop doubting yourself and listen to this.",
        "This 15-second advice will change your life."
    ],
    "Podcast": [
        "The harsh truth about success nobody admits.",
        "This is the secret they don't want you to know.",
        "Listen carefully to what he says right here.",
        "The most controversial take of the interview.",
        "Everyone went silent when he said this..."
    ]
}

def generate_hooks_for_clip(category: str, transcript_text: str = "") -> List[Dict[str, str]]:
    category = category if category in HOOK_TEMPLATES else "Curiosity"
    hooks = []
    
    # Context-adapted primary hook
    primary_category_hooks = HOOK_TEMPLATES[category].copy()
    random.shuffle(primary_category_hooks)
    
    for h in primary_category_hooks[:3]:
        hooks.append({"category": category, "text": h})
        
    # Add hooks from complementary categories
    other_cats = [c for c in HOOK_CATEGORIES if c != category]
    random.shuffle(other_cats)
    for c in other_cats[:3]:
        h = random.choice(HOOK_TEMPLATES[c])
        hooks.append({"category": c, "text": h})
        
    return hooks

def generate_viral_titles(category: str, transcript_summary: str = "") -> List[str]:
    templates = [
        f"This {category} Moment Broke The Internet! 🔥",
        f"Nobody Expected This To Happen Live!",
        f"The Ending Left Everyone Speechless... 😱",
        f"You Won't Believe What Happened Right Here!",
        f"This Is Why Everyone Is Talking About This Clip!",
        f"Wait Until The Final 5 Seconds! 🤯",
        f"Is This The Craziest {category} Clip Ever?!"
    ]
    random.shuffle(templates)
    return templates[:5]

def generate_seo_descriptions(title: str, category: str, hook: str) -> Dict[str, Any]:
    cat_tag = category.lower().replace(" ", "")
    hashtags = [
        f"#{cat_tag}", "#viral", "#shorts", "#trending",
        "#foryou", "#fyp", "#reels", "#clipgenius", "#epicmoments"
    ]
    
    return {
        "youtube_shorts": {
            "title": f"{title} #shorts",
            "description": f"{hook}\n\nWatch this incredible {category.lower()} highlight! Subscribe for more daily viral clips.\n\n" + " ".join(hashtags),
            "tags": [cat_tag, "shorts", "viral", "trending", "clipgenius", "highlights"]
        },
        "instagram_reels": {
            "caption": f"{hook}\n.\nTag a friend who needs to see this! 👇🔥\n.\n" + " ".join(hashtags)
        },
        "tiktok": {
            "caption": f"{hook} 🤯 What would you do? Drop your thoughts below! 👇 " + " ".join(hashtags[:6])
        },
        "hashtags": " ".join(hashtags)
    }
