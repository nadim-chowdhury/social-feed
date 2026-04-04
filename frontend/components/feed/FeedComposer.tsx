"use client";

import { useEffect, useRef, useState } from "react";
import { FeedAvatar } from "./FeedAvatar";
import { currentUser } from "@/lib/feed-data";
import {
  FileSelectionHandler,
  ImagePreviewState,
  OrchestrationStatus,
  PostVisibility,
} from "@/types/feed";
import {
  useCreatePostMutation,
  useGetUploadSignatureMutation,
} from "@/services/postsApi";

const actions = [
  {
    id: "photo",
    label: "Photo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
        />
      </svg>
    ),
  },
  {
    id: "video",
    label: "Video",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
        />
      </svg>
    ),
  },
  {
    id: "event",
    label: "Event",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692z"
        />
      </svg>
    ),
  },
  {
    id: "article",
    label: "Article",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="20"
        fill="none"
        viewBox="0 0 18 20"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752z"
        />
      </svg>
    ),
  },
];

export function FeedComposer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [getSignature, { isLoading: isSigning }] =
    useGetUploadSignatureMutation();

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<OrchestrationStatus>("IDLE");
  const [previewUrl, setPreviewUrl] = useState<ImagePreviewState>(null);
  const [visibility, setVisibility] = useState<PostVisibility>("PUBLIC");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleImageSelect: FileSelectionHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Invalid format");
      return;
    }

    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("Image exceeds 5MB limit.");
      return;
    }

    setImageFile(file);
  };
  const triggerFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return;

    try {
      setStatus("SIGNING");
      let finalImageUrl = null;

      if (imageFile) {
        const { signature, timestamp, apiKey, cloudName, folder } =
          await getSignature().unwrap();

        setStatus("UPLOADING_CLOUD");
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("signature", signature);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        finalImageUrl = (await uploadRes.json()).secure_url;
      }

      setStatus("PUBLISHING");
      await createPost({
        content,
        imageUrl: finalImageUrl,
        visibility,
      }).unwrap();

      setContent("");
      setImageFile(null);
      setStatus("IDLE");
    } catch (err) {
      setStatus("FAILED");
    }
  };

  return (
    <section className="mb-4 rounded-md bg-white p-6 shadow-sm">
      <div className="flex gap-3">
        <FeedAvatar
          name={currentUser.name}
          seed={currentUser.avatarSeed}
          size="sm"
        />
        <div className="relative min-w-0 flex-1">
          <label htmlFor="feed-composer" className="sr-only">
            Write something
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
            className="ml-auto text-sm text-[#516170] border border-black/20 px-2 py-px rounded-md mb-4"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <textarea
            id="feed-composer"
            rows={3}
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[88px] w-full resize-y rounded-md px-3 py-3 text-[#112032] placeholder:text-[#666] outline-none focus:border-[#1890FF]/40 focus:ring-2 focus:ring-[#1890FF]/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
          />

          {previewUrl && (
            <div className="relative mt-3 inline-block">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="h-12 w-auto rounded-md border border-black/10 object-cover"
              />
              <button
                type="button"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => {
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="sr-only disabled:bg-gray-400 disabled:cursor-not-allowed"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageSelect}
          />
        </div>
      </div>

      <div className="mt-4 hidden flex-wrap items-center justify-between gap-3 rounded-md py-2 px-4 md:flex bg-[#F3F9FF]">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              disabled={isCreatingPost || isSigning}
              onClick={a.id === "photo" ? triggerFileExplorer : undefined}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[#666] hover:bg-[#F8F9FB] group hover:text-[#1890FF] disabled:cursor-not-allowed"
            >
              <span className="text-[#666] group-hover:text-[#1890FF]">
                {a.icon}
              </span>
              {a.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handlePost}
          disabled={isCreatingPost || isSigning || status !== "IDLE"}
          className="inline-flex items-center gap-2 rounded-md bg-[#1890FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1677d9] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="13"
            fill="none"
            viewBox="0 0 14 13"
            aria-hidden
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
              clipRule="evenodd"
            />
          </svg>
          Post
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-black/5 pt-4 md:hidden">
        <div className="flex flex-wrap justify-between gap-2">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-md border border-black/10 bg-[#F8F9FB] px-2 py-2 text-[#666]"
              aria-label={a.label}
            >
              {a.icon}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1890FF] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="13"
            fill="none"
            viewBox="0 0 14 13"
            aria-hidden
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
              clipRule="evenodd"
            />
          </svg>
          Post
        </button>
      </div>
    </section>
  );
}
