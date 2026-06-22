import {
  Activity,
  CircleHelp,
  FlaskConical,
  Home,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Why Predict Age",
    path: "/why-predict",
    icon: CircleHelp,
  },
  {
    title: "Predict Bone Age",
    path: "/predict",
    icon: FlaskConical,
  },
  {
    title: "How It Works",
    path: "/workflow",
    icon: RefreshCw,
  },
  {
    title: "Technology",
    path: "/tech",
    icon: Settings,
  },
  {
    title: "About Team",
    path: "/about",
    icon: Users,
  },
];

export const pageTitles = navigationItems.reduce(
  (acc, item) => ({
    ...acc,
    [item.path]: item.title,
  }),
  {},
);

export const BrandIcon = ({ className = "h-9 w-9" }) => (
  <span
    className={`inline-flex items-center justify-center rounded-xl bg-primary text-white ${className}`}
    aria-hidden="true"
  >
    <Activity className="h-5 w-5" />
  </span>
);
