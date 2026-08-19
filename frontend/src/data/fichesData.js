import { 
  Wind, 
  HeartHandshake, 
  Anchor, 
  LifeBuoy, 
  Users, 
  Zap 
} from "lucide-react";

export const FICHES_DATA = [
  {
    id: 1,
    title: "Gérer l'anxiété au quotidien",
    description: "Conseils pratiques et habitudes simples pour réduire le stress jour après jour.",
    buttonText: "Lire la fiche",
    actionUrl: "/fiches/anxiete",
    icon: Wind,
    iconColor: "text-[#3B6978]"
  },
  {
    id: 2,
    title: "Aider un proche en souffrance",
    description: "Attitudes et réflexes bienveillants pour soutenir une personne vulnérable.",
    buttonText: "En savoir plus",
    actionUrl: "/fiches/aider-proche",
    icon: HeartHandshake,
    iconColor: "text-[#8B5A33]"
  },
  {
    id: 3,
    title: "Exercices d'ancrage pour couper les pensées",
    description: "Techniques réflexes (dont le 5-4-3-2-1) pour stopper la rumination et revenir au présent.",
    buttonText: "Découvrir",
    actionUrl: "/fiches/ancrage",
    icon: Anchor,
    iconColor: "text-[#4A5D4E]"
  },
  {
    id: 4,
    title: "J'ai des idées noires",
    description: "Étapes de sécurité et repères immédiats pour traverser un moment très sombre.",
    buttonText: "Besoin d'aide",
    actionUrl: "/fiches/idees-noires",
    icon: LifeBuoy,
    iconColor: "text-[#934B36]"
  },
  {
    id: 5,
    title: "Je me sens seul",
    description: "Pistes concrètes et rassurantes pour briser la solitude pas à pas.",
    buttonText: "Lire la fiche",
    actionUrl: "/fiches/isolement",
    icon: Users,
    iconColor: "text-[#8B6E33]"
  },
  {
    id: 6,
    title: "J'ai une crise de panique",
    description: "Guide d'urgence pas à pas pour apaiser les symptômes physiques d'une attaque.",
    buttonText: "Calmer la crise",
    actionUrl: "/fiches/crise-panique",
    icon: Zap,
    iconColor: "text-[#6B4E71]"
  }
];