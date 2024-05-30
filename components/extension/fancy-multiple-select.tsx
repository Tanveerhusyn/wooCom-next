"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "../ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Framework = Record<"value" | "label", string>;

export default function FancyMultiSelect({
  tags,
  selectedTags,
  setSelectedTags,
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [FRAMEWORKS, setFRAMEWORKS] = React.useState<Framework[]>([]);

  React.useEffect(() => {
    const results = tags.map((tag) => {
      return {
        value: tag.name,
        label: tag.name,
      };
    });
    setFRAMEWORKS(results);
  }, [tags]);

  const [selected, setSelected] = React.useState<Framework[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (framework) => {
      setSelected((prev) => prev.filter((s) => s.value !== framework.value));
      setSelectedTags((prev) => prev.filter((s) => s.name !== framework.value));
    },
    [setSelectedTags],
  );

  const handleKeyDown = React.useCallback((e) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const handleAddNewTag = () => {
    const newTag = { value: inputValue, label: inputValue };
    setSelected((prev) => [...prev, newTag]);
    setSelectedTags((prev) => [...prev, { name: inputValue }]);
    setInputValue("");
  };

  const selectables = FRAMEWORKS.filter(
    (framework) => !selected.includes(framework),
  );

  const isNewTag =
    inputValue &&
    !FRAMEWORKS.some((f) => f.value === inputValue) &&
    !selected.some((s) => s.value === inputValue);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="default">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select tags or write new one ..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && (selectables.length > 0 || isNewTag) ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, framework]);
                        setSelectedTags((prev) => [
                          ...prev,
                          { name: framework.value },
                        ]);
                      }}
                      className="cursor-pointer"
                    >
                      {framework.label}
                    </CommandItem>
                  );
                })}
                {isNewTag && (
                  <CommandItem
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={handleAddNewTag}
                    className="cursor-pointer"
                  >
                    Create new tag &quot;{inputValue}&quot;
                  </CommandItem>
                )}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
