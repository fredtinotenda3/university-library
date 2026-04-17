"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

// IMPORTANT: Fix the authenticator to return the correct format
const authenticator = async () => {
  try {
    const response = await fetch("/api/auth/imagekit");
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return in the format ImageKit expects
    return {
      token: data.token,
      expire: data.expire,
      signature: data.signature
    };
  } catch (error) {
    console.error("Authenticator error:", error);
    throw error;
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef<any>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.error("Upload error:", error);
    toast({
      title: `${type} upload failed`,
      description: error?.message || `Your ${type} could not be uploaded.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    console.log("Upload success:", res);
    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);
    toast({
      title: `${type} uploaded successfully`,
      description: "File has been uploaded!",
    });
  };

  const onUploadProgress = (progressEvent: any) => {
    if (progressEvent.lengthComputable) {
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      setProgress(percent);
    }
  };

  const onUploadStart = () => {
    setProgress(0);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="space-y-2">
        <button
          type="button"
          className={cn("upload-btn", styles.button)}
          onClick={() => {
            if (ikUploadRef.current) {
              ikUploadRef.current.click();
            }
          }}
        >
          <Image
            src="/icons/upload.svg"
            alt="upload-icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        </button>

        <IKUpload
          ref={ikUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          useUniqueFileName={true}
          folder={folder}
          accept={accept}
          className="hidden"
        />

        {progress > 0 && progress < 100 && (
          <div className="w-full rounded-full bg-gray-700 mt-2">
            <div 
              className="progress bg-green-500 text-xs text-center p-0.5 rounded-full" 
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {file && file.filePath && (
          <>
            <p className={cn("upload-filename text-xs", styles.text)}>
              {file.filePath.split('/').pop()}
            </p>
            {type === "image" && (
              <IKImage
                alt="uploaded-image"
                path={file.filePath}
                width={200}
                height={200}
                className="rounded-md mt-2"
              />
            )}
          </>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default FileUpload;