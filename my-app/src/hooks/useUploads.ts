import { useState, useCallback } from "react";
import { UseUploadsOptions, UploadProgress } from "@/lib/types";

export function useUploads({ maxConcurrentUploads = 3 }: UseUploadsOptions = {}) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [activeUploads, setActiveUploads] = useState(0);

  const addUpload = useCallback((fileName: string) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUpload: UploadProgress = {
      id,
      fileName,
      progress: 0,
      status: 'pending',
    };
    
    setUploads(prev => [...prev, newUpload]);
    return id;
  }, []);

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setUploads(prev => 
      prev.map(upload => 
        upload.id === id ? { ...upload, progress, status: 'uploading' } : upload
      )
    );
  }, []);

  const updateUploadStatus = useCallback((id: string, status: UploadProgress['status'], error?: string) => {
    setUploads(prev => 
      prev.map(upload => 
        upload.id === id ? { ...upload, status, error } : upload
      )
    );
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  return {
    uploads,
    activeUploads,
    setActiveUploads,
    addUpload,
    updateUploadProgress,
    updateUploadStatus,
    removeUpload,
    clearUploads,
    maxConcurrentUploads,
  };
}