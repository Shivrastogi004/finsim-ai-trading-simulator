
"use client"

import Link from "next/link"
import Image from "next/image"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { BarChart, BookOpen, Bot, Cpu, History, Newspaper, ShieldCheck, Zap, Star, Lightbulb, CheckCircle, Scale } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

const features = [
  {
    icon: BarChart,
    title: "Strategy Backtesting",
    description: "Test trading ideas on historical data to validate strategies before risking capital.",
  },
  {
    icon: BookOpen,
    title: "Paper Trading",
    description: "Practice in a risk-free, simulated market to hone your skills with virtual funds.",
  },
  {
    icon: Newspaper,
    title: "Sentiment Analysis",
    description: "Analyze market mood from news headlines to inform your trading decisions.",
  },
  {
    icon: Cpu,
    title: "AI-Driven Signals",
    description: "Receive actionable buy/sell signals from our advanced AI, with clear explanations.",
  },
  {
    icon: History,
    title: "AI-Powered Historical Data",
    description: "Let our AI find relevant historical data based on market sentiment to test strategies.",
  },
  {
    icon: Bot,
    title: "AI Feature Suggestions",
    description: "Our AI analyzes backtest results and suggests improvements to boost profitability.",
  },
]

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Day Trader",
    avatar: "https://picsum.photos/seed/alex/100",
    aiHint: "man portrait",
    review: "FinSim's backtesting engine is a game-changer. The AI suggestions helped me refine my strategy and improve my profitability by over 15% in just a month. Absolutely essential tool.",
  },
  {
    name: "Samantha Lee",
    role: "Beginner Investor",
    avatar: "https://picsum.photos/seed/samantha/100",
    aiHint: "woman portrait",
    review: "As someone new to trading, FinSim was the perfect sandbox. The paper trading feature let me learn the ropes without any risk. I feel so much more confident now!",
  },
  {
    name: "Mike Chen",
    role: "Financial Analyst",
    avatar: "https://picsum.photos/seed/mike/100",
    aiHint: "man portrait glasses",
    review: "The sentiment analysis is incredibly powerful for gauging market mood. It gives me an edge by providing insights I wouldn't find in traditional reports. Highly recommended.",
  },
]

export function WelcomePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
               <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold">FinSim</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                 <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative isolate">
          {/* Hero Section */}
          <section className="py-24 sm:py-32 md:py-40">
            <div className="container px-4 text-center">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 !leading-tight">
                Your Personal AI <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Trading Laboratory</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                FinSim is your AI-powered sandbox for the stock market. Backtest strategies, practice with paper money, and get AI-driven insights—all before you risk a single dollar.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity shadow-lg">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                   <Link href="/demo">Learn More</Link>
                </Button>
              </div>
              <div className="mt-20 flex justify-center">
                  <div className="rounded-xl shadow-2xl ring-1 ring-border/20 bg-card/50 p-2 backdrop-blur-sm">
                       <Image 
                          src="https://picsum.photos/seed/stock-dashboard/1200/600"
                          alt="FinSim Dashboard"
                          width={1200}
                          height={600}
                          className="rounded-lg"
                          data-ai-hint="stock chart dashboard"
                       />
                  </div>
              </div>
            </div>
          </section>
        </div>

        {/* Why FinSim Section */}
        <section className="py-20 sm:py-32">
            <div className="container px-4">
                 <div className="text-center mb-16">
                    <p className="text-base font-semibold leading-7 text-primary">WHY FINSIM?</p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">An Unfair Advantage</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        We built FinSim from the ground up to give you the tools and insights previously only available to the pros.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="text-center p-8 border rounded-xl bg-card hover:shadow-xl hover:-translate-y-1 transition-all">
                          <Lightbulb className="h-12 w-12 text-primary mb-4 mx-auto"/>
                          <h3 className="text-xl font-bold">AI at the Core</h3>
                          <p className="text-muted-foreground mt-2">Unlike other platforms where AI is an afterthought, FinSim is built with AI as your collaborative partner, not just a feature.</p>
                      </div>
                      <div className="text-center p-8 border rounded-xl bg-card hover:shadow-xl hover:-translate-y-1 transition-all">
                          <CheckCircle className="h-12 w-12 text-green-500 mb-4 mx-auto"/>
                           <h3 className="text-xl font-bold">Actionable Insights</h3>
                          <p className="text-muted-foreground mt-2">We don't just give you data; we give you explainable insights. Our XAI tells you *why* a signal was generated, helping you learn.</p>
                      </div>
                      <div className="text-center p-8 border rounded-xl bg-card hover:shadow-xl hover:-translate-y-1 transition-all">
                          <Scale className="h-12 w-12 text-yellow-500 mb-4 mx-auto"/>
                           <h3 className="text-xl font-bold">A Simulated World</h3>
                          <p className="text-muted-foreground mt-2">FinSim is a powerful simulator, but not a live brokerage. Use FinSim to learn and test, then apply your knowledge cautiously.</p>
                      </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-secondary/30">
          <div className="container px-4">
            <div className="text-center mb-16">
                <p className="text-base font-semibold leading-7 text-primary">FEATURES</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    A powerful suite of tools to help you navigate the markets with confidence, powered by cutting-edge AI.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-xl bg-secondary/30 p-0.5 shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:!scale-105">
                  <div className="rounded-[11px] h-full bg-background p-6">
                    <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 sm:py-32">
          <div className="container px-4">
            <div className="text-center mb-16">
              <p className="text-base font-semibold leading-7 text-primary">TESTIMONIALS</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Loved by Traders Worldwide</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our users have to say about their experience with FinSim.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="flex flex-col justify-between rounded-xl bg-card p-6 shadow-lg border">
                  <div>
                    <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current"/>)}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.review}"</p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                     <Avatar>
                        <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} data-ai-hint={testimonial.aiHint} />
                      </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32">
          <div className="container px-4 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Ready to Elevate Your Trading?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Sign up today and start leveraging the power of AI in your trading journey. No risks, all reward. Your future self will thank you.
            </p>
            <div className="mt-8">
               <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all hover:scale-105 shadow-2xl">
                <Link href="/signup">Start Your Free Simulation Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row max-w-screen-2xl">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FinSim. All rights reserved.</p>
            <div className="flex items-center gap-4">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}
