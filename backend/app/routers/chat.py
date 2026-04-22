from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import httpx
import random
from app.dependencies import get_current_user
from app.config import Settings

router = APIRouter()
settings = Settings()

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _openrouter_headers():
    api_key = settings.openrouter_api_key
    print(f"OpenRouter API key length: {len(api_key)}")
    print(f"OpenRouter API key prefix: {api_key[:10]}...")
    
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


async def _openrouter_chat(prompt: str, *, timeout: int = 60, json_mode: bool = False) -> Optional[str]:
    """Call OpenRouter and return the assistant message text, or None on failure."""
    body: dict = {
        "model": settings.openrouter_model,
        "messages": [{"role": "user", "content": prompt}],
    }
    if json_mode:
        body["response_format"] = {"type": "json_object"}
    
    try:
        headers = _openrouter_headers()
        print(f"OpenRouter request headers: {headers}")
        print(f"OpenRouter request body: {body}")
        
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(OPENROUTER_URL, headers=headers, json=body)
            print(f"OpenRouter response status: {resp.status_code}")
            print(f"OpenRouter response: {resp.text}")
            
            if resp.status_code == 200:
                data = resp.json()
                if "choices" in data and len(data["choices"]) > 0:
                    text = data["choices"][0]["message"]["content"].strip()
                    if text and len(text) > 5:
                        return text
            else:
                print(f"OpenRouter error response: {resp.text}")
    except Exception as e:
        print(f"OpenRouter API error: {e}")
        pass
    return None


async def _ai_chat(prompt: str, *, timeout: int = 60, json_mode: bool = False) -> Optional[str]:
    """Route to OpenRouter."""
    if settings.openrouter_api_key:
        return await _openrouter_chat(prompt, timeout=timeout, json_mode=json_mode)
    return None


FALLBACK_TIPS = [
    # --- Category 1: Consistency & Discipline ---
    "Consistency beats intensity every single time. 20 minutes today is better than 4 hours on Saturday.",
    "The secret of getting ahead is getting started. Don't wait for motivation; rely on your system.",
    "Your streak is your most valuable asset. Protect it like your career depends on it—because it does.",
    "Successful people do what they need to do even when they don't feel like doing it.",
    "Motivation is what gets you started. Habit is what keeps you going. Focus on building the habit.",
    "Don't break the chain. Use a calendar to mark your progress daily and keep that momentum.",
    "Small daily improvements over time lead to stunning results. Never underestimate the power of 1%.",
    "Discipline is choosing between what you want now and what you want most.",
    "If you're tired, learn to rest, not to quit. A 5-minute session counts as showing up.",
    "The quality of your life is determined by the quality of your habits. Build better learning habits.",
    "Amateurs wait for inspiration. Professionals get to work even on their worst days.",
    "Focus on the process, not the outcome. If you show up every day, the outcome takes care of itself.",
    "Show up, even if you only write one line of code. The act of showing up is the real victory.",
    "Don't compare your Chapter 1 to someone else's Chapter 20. Your progress is unique to you.",
    "The hardest part of any task is simply starting. Commit to just 5 minutes and see what happens.",
    "Consistency creates the momentum that makes the difficult things eventually feel easy.",
    "Great things are not done by impulse, but by a series of small things brought together.",
    "Laziness is just a habit of resting before you get tired. Break the cycle with action.",
    "You don't need more time; you need more focus. Block out distractions and go deep.",
    "The only bad workout is the one that didn't happen. The same applies to your learning sessions.",

    # --- Category 2: Overcoming Blocks & Stuckness ---
    "Feeling stuck is a sign that you're operating at the edge of your comfort zone. That's where growth happens.",
    "If you're stuck on a bug, walk away from the screen. A 10-minute walk often brings the solution.",
    "Explain the problem to a rubber duck. Speaking the logic out loud exposes the gaps in your thinking.",
    "Break the problem down into the smallest possible parts. Solve the tiniest part first.",
    "When you feel overwhelmed, it's usually because you're looking at the whole mountain instead of the next step.",
    "There is no failure, only feedback. A bug is just an opportunity to learn how something works deeply.",
    "Documentation is your best friend. Spend 15 minutes reading it before jumping to StackOverflow.",
    "Ask for help, but only after you've spent 20 minutes trying to solve it yourself. Document your attempts.",
    "The expert in anything was once a beginner who refused to give up when they got stuck.",
    "Complex problems are just a collection of simple problems waiting to be solved one by one.",
    "If it's too hard, you've skipped a step. Go back to the fundamentals and solidify your foundation.",
    "Your brain continues to solve problems while you sleep. Trust the process and get some rest.",
    "A mistake is only a failure if you don't learn from it. Analyze what went wrong and move on.",
    "Don't be afraid to delete code and start over. Refactoring is where real mastery is built.",
    "The bridge between 'I don't know' and 'I understand' is built with persistence and curiosity.",
    "Read other people's code. Seeing different approaches expands your mental model of problem-solving.",
    "Debugging is like being a detective in a crime movie where you are also the murderer. Stay humble.",
    "If you can't explain it simply, you don't understand it well enough yet. Keep refining your mental model.",
    "Growth and comfort do not coexist. Embrace the frustration—it's the feeling of your brain upgrading.",
    "You are not your code. Detach your ego from your work to see the solutions more clearly.",

    # --- Category 3: Project-Based Learning ---
    "Theory is useless without application. Build a project for every new concept you learn.",
    "Stop watching tutorials and start building. Struggle is the most effective form of learning.",
    "Your portfolio doesn't need 100 projects; it needs 3 deep, well-architected ones that you can explain.",
    "Build things that solve your own problems. Passion for the solution drives the learning of the technology.",
    "Shipping is a skill. Finishing a 'good enough' project is better than leaving a 'perfect' one unfinished.",
    "Document your project journey. A 'Build Log' is as valuable as the code itself for your growth.",
    "The best way to learn a new framework is to port an existing project to it. Compare the differences.",
    "Feature creep is the enemy of completion. Stick to your MVP (Minimum Viable Product) and ship it.",
    "Your code is meant to be read by humans first and machines second. Focus on clarity and naming.",
    "Version control is not optional. Git everything you build, even the small experiments.",
    "Write tests for your projects. TDD (Test Driven Development) teaches you to think about requirements first.",
    "A project is never truly finished, but it must be 'published.' Put it on GitHub and ask for feedback.",
    "Don't just learn the language; learn the ecosystem around it (tooling, libraries, best practices).",
    "Build in public. Share your progress on Twitter or LinkedIn. It builds accountability and a network.",
    "Re-build a popular app from scratch (like a Trello or Todoist clone). It exposes you to real-world edge cases.",
    "Design matters. Spend a little time on the UI/UX. A polished project is more satisfying to finish.",
    "Learn to read technical requirements. Translating 'human needs' to 'code' is the job of a developer.",
    "The best projects are those that you actually use. Utility provides the best motivation.",
    "Complexity is easy; simplicity is hard. Aim for the simplest possible solution for every feature.",
    "Every line of code you write is a brick in the foundation of your future career.",

    # --- Category 4: Mindset & Mental Models ---
    "Growth mindset is the belief that your abilities can be developed through dedication and hard work.",
    "Imposter syndrome is a sign of ambition. It means you're pushing into new territory. Keep going.",
    "Learning how to learn is more important than learning any specific programming language.",
    "Think in systems, not tasks. If you fix the system, the tasks take care of themselves.",
    "Your environment dictates your behavior. Optimize your workspace for deep work and zero distractions.",
    "Sleep is not a luxury; it's a cognitive requirement for memory consolidation and problem-solving.",
    "The 5-hour rule: Spend at least one hour a day on deliberate learning, regardless of how busy you are.",
    "Be a 'T-shaped' developer: Have deep expertise in one area and broad knowledge across many others.",
    "Communication skills are as important as technical skills. Learn to write and speak clearly.",
    "Stay curious. The moment you think you know everything is the moment you stop growing.",
    "Don't optimize too early. Make it work, make it right, and then make it fast.",
    "Technology changes fast, but fundamentals (data structures, algorithms, design patterns) are timeless.",
    "Learn to embrace uncertainty. Engineering is often about making the best decision with limited information.",
    "Your network is your net worth. Help others learn, and the community will help you when you're stuck.",
    "Be the person who asks 'Why?' and 'How does this work under the hood?' Curiosity leads to mastery.",
    "High-performance learning requires high-performance recovery. Take breaks and stay hydrated.",
    "The most successful developers are those who enjoy the process of solving puzzles every day.",
    "Don't chase every new shiny object. Master one thing before moving to the next.",
    "Focus on high-leverage skills—the ones that make all your other skills more valuable.",
    "Believe in your ability to figure it out. Self-efficacy is the engine of technical growth.",

    # --- Category 5: Career & Long-term Growth ---
    "Your career is a marathon, not a sprint. Pace yourself so you don't burn out before the finish line.",
    "The best way to get a great job is to be the person they can't afford NOT to hire.",
    "Contribute to Open Source. It's the best way to prove you can work in a team and handle real-world code.",
    "Keep your resume/LinkedIn updated with your latest wins. Opportunities come when you're prepared.",
    "Soft skills fetch hard dollars. Improving your empathy and teamwork will accelerate your promotions.",
    "Learn the business side of tech. Understanding how your code makes money makes you a senior engineer.",
    "Mentorship is a two-way street. Find someone ahead of you to learn from, and someone behind you to teach.",
    "Never stop interviewing. It keeps your skills sharp and your market value clear.",
    "The true measure of a senior engineer is how many junior engineers they've helped become seniors.",
    "Specialize in something rare and valuable. Niche expertise often commands higher value.",
    "Documentation is the gift you give to your future self and your future teammates.",
    "Learn to estimate work accurately. It's a hallmark of a professional and reliable developer.",
    "Your online presence (GitHub, Blog, Portfolio) is your modern-day CV. Keep it active and clean.",
    "Automation is your superpower. If you have to do it twice, write a script for it.",
    "Public speaking (or writing) about tech forces you to master the topic at a much deeper level.",
    "Diversity of thought leads to better solutions. Seek out different perspectives in your team.",
    "Be reliable. The best engineers are not just smart; they are the ones you can trust to deliver.",
    "Learn to say 'No' to low-value tasks so you can say 'Yes' to high-impact projects.",
    "Code is liability; functionality is the asset. Write as little code as possible to achieve the goal.",
    "The best time to start was yesterday. The second best time is today. DevTrackr is with you every step!"
]


class ChatMessage(BaseModel):
    message: str
    skill_name: Optional[str] = None
    context: Optional[str] = None
    history: Optional[list] = None


class DailyTipRequest(BaseModel):
    skill_name: Optional[str] = None
    hours_completed: Optional[float] = 0
    streak: Optional[int] = 0


@router.post("/")
async def chat(body: ChatMessage, current_user=Depends(get_current_user)):
    """AI-powered chat for DevTrackr coaching using OpenRouter"""
    history_text = ""
    if body.history:
        for msg in body.history[-6:]:  # Last 3 exchanges
            role = "User" if msg.get("role") == "user" else "Coach"
            history_text += f"{role}: {msg.get('text', '')}\n"

    prompt = f"""You are DevTrackr AI Coach.
You are coaching {current_user.name} (Level {current_user.level}, {current_user.streak} day streak).
Current skill: {body.skill_name or 'General learning'}
Context: {body.context or 'none'}

Previous conversation:
{history_text}

User: {body.message}

Give a motivating, specific, actionable response in 2-4 sentences. Be direct and inspiring like a top coach.
Coach:"""

    reply = await _ai_chat(prompt, timeout=60)
    if reply and len(reply) > 10:
        return {"reply": reply, "model": settings.openrouter_model, "powered_by": "openrouter"}

    # Smart fallback based on message content
    msg_lower = body.message.lower()
    if any(w in msg_lower for w in ["stuck", "help", "how", "what", "explain"]):
        reply = f"For {body.skill_name or 'this skill'}: identify the exact point you're stuck on, then spend 20 minutes on just that concept. Google '[topic] explained in 5 minutes' - visual explanations break most blocks instantly."
    elif any(w in msg_lower for w in ["motivation", "tired", "quit", "give up", "hard"]):
        reply = f"Every expert was once a complete beginner. You have {current_user.streak} days of proof that you can show up. The people who win are not the smartest - they are the most consistent. Today counts."
    elif any(w in msg_lower for w in ["time", "busy", "schedule", "plan"]):
        reply = "Block 45 minutes every morning before your day starts. Morning sessions have the highest focus quality and zero interruptions. Even 3 sessions per week beats zero sessions perfectly planned."
    else:
        reply = random.choice(FALLBACK_TIPS)  # nosec B311 - non-security use case

    return {"reply": reply, "model": "fallback", "powered_by": "devtrackr"}


@router.post("/daily-tip")
async def daily_tip(body: DailyTipRequest, current_user=Depends(get_current_user)):
    """Get a personalized daily AI tip from Gemini or OpenRouter"""
    prompt = f"""Generate one powerful learning tip for {current_user.name}.
Skill: {body.skill_name or 'general development'}
Hours completed today: {body.hours_completed}
Current streak: {body.streak} days

Give ONE specific, actionable tip in exactly 2 sentences. Make it feel personal and motivating.
Tip:"""

    tip = await _ai_chat(prompt, timeout=60)
    if tip and len(tip) > 20:
        model_name = settings.openrouter_model
        return {"tip": tip, "model": model_name}

    return {"tip": random.choice(FALLBACK_TIPS), "model": "fallback"}  # nosec B311 - non-security use case


@router.post("/skill-suggestions")
async def skill_suggestions(
    body: dict, current_user=Depends(get_current_user)
):
    """AI-powered skill roadmap suggestions using Gemini or OpenRouter"""
    import json

    query = body.get("query", "")
    existing = body.get("existing_skills", [])

    prompt = f"""Suggest 5 learning goals for someone who wants to learn: "{query}"
They already know: {', '.join(existing) or 'nothing specified'}

Return JSON array ONLY — no explanation, just the array:
[{{"name": "Skill Name", "icon": "emoji", "total_hours": 50, "daily_target": 2, "why": "one sentence reason"}}]"""

    raw = await _ai_chat(prompt, timeout=20, json_mode=True)
    if raw:
        try:
            parsed = json.loads(raw)
            suggestions = parsed if isinstance(parsed, list) else parsed.get("suggestions", [])
            if isinstance(suggestions, list) and len(suggestions) > 0:
                model_name = settings.gemini_model if settings.use_gemini else settings.openrouter_model
                return {"suggestions": suggestions[:5], "model": model_name}
        except (json.JSONDecodeError, AttributeError):
            pass

    # Fallback suggestions
    fallback = [
        {"name": f"{query} Fundamentals", "icon": "📚", "total_hours": 40, "daily_target": 2, "why": "Build a rock-solid foundation before advancing"},
        {"name": f"{query} — Build Projects", "icon": "🚀", "total_hours": 60, "daily_target": 2, "why": "Real projects = real retention"},
        {"name": f"Advanced {query}", "icon": "⚡", "total_hours": 80, "daily_target": 3, "why": "Go beyond tutorials to expert-level mastery"},
        {"name": "System Design", "icon": "🏗️", "total_hours": 50, "daily_target": 2, "why": "Think like a senior engineer from day one"},
        {"name": "Interview Prep", "icon": "🎯", "total_hours": 30, "daily_target": 1, "why": "Convert your skills into career opportunities"},
    ]
    return {"suggestions": fallback, "model": "fallback"}
