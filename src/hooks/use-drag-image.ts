import { useEffect, DragEvent, useState } from "react";

export const useDragImage = () => {
  const [imageSrc, setImageSrc] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    if (dragCounter === 0) {
      setIsDragging(false); // Only set to false when completely left
    }
  }, [dragCounter]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Reset dragging state

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageSrc(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter((prevCount) => prevCount + 1); // Increment counter

    if (e.dataTransfer.items[0]?.type.startsWith("image/")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter((prevCount) => prevCount - 1); // Decrement counter
  };

  return {
    imageSrc,
    isDragging,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  };
};
