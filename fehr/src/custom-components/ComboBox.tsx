"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import axios from "axios";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import getToken from "@/auth.ext/GetToken";
import Spinner from "./Spinner";

interface Account {
  glCode: string;
  glAccountName: string;
}

const initialAccounts: Account[] = [];

interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function Combobox({ value, onValueChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [accounts, setAccounts] = React.useState(initialAccounts);
  const [filteredAccounts, setFilteredAccounts] =
    React.useState(initialAccounts);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL = "https://odeldevfinanceapi.azurewebsites.net";
  React.useEffect(() => {
    const fetchGLCodes = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const response = await axios.get<Account[]>(
          `${API_URL}/api/non-assess/nonassess`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          const glAccounts: Account[] = response.data
            .filter((item: any) => !item.hasSubCategory)
            .map(
              (item: any): Account => ({
                glCode: item.glCode || "",
                glAccountName: item.accountName || "",
              })
            );

          // Deduplicate based on glCode
          const uniqueAccounts: Account[] = glAccounts.filter(
            (account, index, self) =>
              index === self.findIndex((a) => a.glCode === account.glCode)
          );

          // console.log("Mapped accounts (unique):", uniqueAccounts);

          setAccounts(uniqueAccounts);
          setFilteredAccounts(uniqueAccounts);
        } else {
          throw new Error("API response is not an array");
        }
      } catch (error) {
        console.error("Error fetching GL codes:", error);
        setError("Failed to fetch accounts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGLCodes();
  }, []);

  const handleInputChange = (inputValue: string) => {
    const filtered = accounts.filter(
      (account) =>
        account.glCode.toLowerCase().includes(inputValue.toLowerCase()) ||
        account.glAccountName.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

  const selectedAccount = accounts.find((account) => account.glCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full item justify-between h-8"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader className="animate-spin h-4 w-4 ml-2" />
            </div>
          ) : (
            <>
              {selectedAccount
                ? `${selectedAccount.glCode} - ${
                    selectedAccount.glAccountName || "No name available"
                  }`
                : "Select an account"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0">
        <Command>
          <CommandInput
            placeholder="Search accounts..."
            onValueChange={handleInputChange}
            disabled={loading}
          />
          <CommandList>
            {loading ? (
              <div className="flex text-center p-2">
                <Spinner />
              </div>
            ) : error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : (
              <>
                <CommandEmpty>No accounts found.</CommandEmpty>
                <CommandGroup>
                  {filteredAccounts.map((account) => (
                    <CommandItem
                      key={account.glCode}
                      onSelect={() => {
                        onValueChange(account.glCode);
                        setOpen(false);
                      }}
                    >
                      {`${account.glCode} - ${
                        account.glAccountName || "No name available"
                      }`}
                      {value === account.glCode && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
