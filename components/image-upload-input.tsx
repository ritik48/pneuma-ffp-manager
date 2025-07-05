"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

type Props = {
  value?: FileList;
  onChange: (value: FileList | undefined) => void;
  existingImageUrl?: string;
};

export function ImageUploadInput({ value, onChange, existingImageUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value?.[0]) {
      const url = URL.createObjectURL(value[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onChange(files);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative w-full h-32 rounded-md overflow-hidden border group cursor-pointer flex items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <img
        src={previewUrl || existingImageUrl || "/placeholder.png"}
        alt="Preview"
        onClick={handleClick}
        className={`transition duration-300 ${
          previewUrl || existingImageUrl
            ? "w-full h-full object-contain"
            : "w-10 h-10 object-contain m-auto opacity-50"
        }`}
      />
      <div
        onClick={handleClick}
        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
      >
        <Upload className="w-5 h-5 mr-2" />
        <span className="text-sm">
          {!existingImageUrl && !previewUrl ? "Upload" : "Change"}
        </span>
      </div>

      {previewUrl && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 p-1 bg-white text-black rounded-full shadow"
          onClick={handleRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
