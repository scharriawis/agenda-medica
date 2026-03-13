import { Link } from "@inertiajs/react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} 
from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

interface User {
  name: string;
  email: string;
  role?: string;
}

export default function UserDropdown({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-[#19140035] py-1 px-3 cursor-pointer">
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {/* Header con info */}
        <DropdownMenuLabel className="flex flex-col items-start px-3 py-2">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Opción settings */}
        <DropdownMenuItem asChild>
          <Link href={edit()} className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Botón de Logout */}
        <DropdownMenuItem asChild>
          <Link
            href={logout()}
            method="post"
            as="button"
            className="flex w-full items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
