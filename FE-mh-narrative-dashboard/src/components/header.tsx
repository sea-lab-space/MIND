import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HeaderProps } from "@/types/props";

const Header: React.FC<HeaderProps> = (props) => {
  const { patientNames, userName } = props;
  const [open, setOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("John Doe");

  // TODO: does not handle repeatitive name
  const people = patientNames.map((name: string) => ({
    value: name,
    label: name,
  }));

  return (
    <div className="w-full bg-white border-b border-[#d9d9d9]">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left - Brand */}
        <div className="flex items-center w-1/3">
          <h1 className="text-xl font-bold text-black tracking-tight">MIND</h1>
        </div>

        {/* Center - Person Selector */}
        <div className="flex items-center w-1/3 justify-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between bg-transparent hover:bg-gray-50 text-black font-normal"
              >
                {selectedPerson}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search person..." />
                <CommandList>
                  <CommandEmpty>No person found.</CommandEmpty>
                  <CommandGroup>
                    {people.map((person) => (
                      <CommandItem
                        key={person.value}
                        value={person.value}
                        onSelect={(currentValue) => {
                          const selectedPersonData = people.find(
                            (p) => p.value === currentValue
                          );
                          setSelectedPerson(selectedPersonData?.label || "");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPerson === person.label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {person.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right - Retrospect Navigation and Avatar */}
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <p>Retrospect:</p>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 text-black font-normal">
                  2 Weeks
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div>
                    TBD
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Avatar className="w-10 h-10 bg-[#b3adad] border border-[#d9d9d9]">
            <AvatarFallback className="bg-[#b3adad] text-black font-semibold">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Header;