import {
  GraduationCap, Briefcase, FileText, Landmark, Users, Leaf, ShieldCheck,
  Laptop, Search, Scale, HeartPulse, Megaphone, Mail, Globe, UserRound,
  Building2, FileSpreadsheet, UserCheck, MessagesSquare, HelpCircle
} from "lucide-react";

// One consistent icon family (lucide, 1.75 stroke) across the Help Centre.
const HELP_ICON_MAP = {
  ngo: Building2,
  government: Landmark,
  education: GraduationCap,
  career: Briefcase,
  documents: FileText,
  research: Search,
  agriculture: Leaf,
  women: Users,
  senior: UserRound,
  forms: FileSpreadsheet,
  digital: Laptop,
  cyber: ShieldCheck,
  email: Mail,
  website: Globe,
  legal: Scale,
  health: HeartPulse,
  community: Megaphone,
  people: Users,
  check: UserCheck,
  chat: MessagesSquare
};

export default function HelpIcon({ name, className = "h-5 w-5" }) {
  const Icon = HELP_ICON_MAP[name] || HelpCircle;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
