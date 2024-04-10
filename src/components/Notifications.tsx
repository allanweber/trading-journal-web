import { Bell } from "lucide-react";
import { Button } from "./ui/button";

export const Notifications = () => {
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <Bell className="h-5 w-5" />
      <span className="sr-only">Toggle notifications</span>
    </Button>
  );
};
