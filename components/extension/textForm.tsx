"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "../ui/select";
import { Input } from "../ui/input";

export default function TextForm() {
  return (
    <div className="bg-white/10 rounded-lg flex justify-center items-center p-4">
      <form className="grid grid-cols-2 gap-4 max-w-lg w-full max-w-[1200px] p-4 bg-black">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
              <SelectItem value="category3">Category 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank-math-focus-keyword">
            Rank Math Focus Keyword
          </Label>
          <Input
            id="rank-math-focus-keyword"
            placeholder="Rank Math Focus Keyword"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="Description" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank-math-title">Rank Math Title</Label>
          <Input id="rank-math-title" placeholder="Rank Math Title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Tags" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select id="size">
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fit">Fit</Label>
          <Select id="fit">
            <SelectTrigger>
              <SelectValue placeholder="Select fit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="loose">Loose</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Select id="style">
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="sporty">Sporty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="rank-math-description">Rank Math Description</Label>
          <Input
            id="rank-math-description"
            placeholder="Rank Math Description"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Title" />
        </div>
      </form>
    </div>
  );
}
