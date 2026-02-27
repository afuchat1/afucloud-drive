import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  size?: "sm" | "md";
}

const md5 = async (str: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
};

const UserAvatar = ({ className, size = "sm" }: UserAvatarProps) => {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const name = (user?.user_metadata?.full_name as string) || email;
  const initials = name
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  // Gravatar URL with 404 fallback so AvatarImage falls through to AvatarFallback
  const gravatarUrl = `https://www.gravatar.com/avatar/${encodeURIComponent(email.trim().toLowerCase())}?d=404&s=80`;

  return (
    <Avatar className={cn(size === "sm" ? "h-7 w-7" : "h-9 w-9", className)}>
      <AvatarImage src={gravatarUrl} alt={name} />
      <AvatarFallback className="bg-primary/10 text-xs font-medium text-brand">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
