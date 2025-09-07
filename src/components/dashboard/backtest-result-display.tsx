"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Filter, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { ReactNode } from "react";

interface BacktestResultDisplayProps {
  suggestedFeatures: string;
}

interface FeatureSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
}

function parseFeatures(text: string): FeatureSection[] {
  const sections: FeatureSection[] = [];
  const lines = text.split("\n").filter(line => line.trim() !== "");

  let currentSection: FeatureSection | null = null;

  const sectionMappings: Record<string, { icon: React.ComponentType<{ className?: string }>, title: string }> = {
    "Signal Enhancement & Filtering": { icon: Filter, title: "Signal Enhancement & Filtering" },
    "Risk Management & Trade Management": { icon: ShieldCheck, title: "Risk Management & Trade Management" },
    "Optimization & Robustness": { icon: Zap, title: "Optimization & Robustness" },
  };

  for (const line of lines) {
    const sectionMatch = line.match(/### I\.\s+(.*)/) || line.match(/### II\.\s+(.*)/) || line.match(/### III\.\s+(.*)/);

    if (sectionMatch) {
      const title = sectionMatch[1].trim();
      const mapping = Object.values(sectionMappings).find(m => m.title === title) || { icon: Lightbulb, title };
      
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: mapping.title, icon: mapping.icon, content: [] };
    } else if (currentSection && (line.match(/^\d\./) || line.match(/^\*/))) {
      currentSection.content.push(line.replace(/^\d\.\s*/, "").replace(/^\*\s*/, "").trim());
    } else if (currentSection && currentSection.content.length > 0 && !line.startsWith("---") && !line.startsWith("Example")) {
       currentSection.content[currentSection.content.length - 1] += ` ${line.trim()}`;
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}


export function BacktestResultDisplay({
  suggestedFeatures,
}: BacktestResultDisplayProps) {
  const parsedSections = parseFeatures(suggestedFeatures);
  const introText = suggestedFeatures.split("---")[0];


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Suggested Features
        </CardTitle>
        <CardDescription>
            {introText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={parsedSections.map(s => s.title)}>
          {parsedSections.map((section) => (
            <AccordionItem key={section.title} value={section.title}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-14">
                <ul className="space-y-3 text-muted-foreground">
                  {section.content.map((item, index) => (
                     <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/>
                        <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
