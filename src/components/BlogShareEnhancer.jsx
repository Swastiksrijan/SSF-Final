import { useEffect } from "react";

const SITE_URL = "https://swastiksrijan.in";

export default function BlogShareEnhancer({ children }) {
  useEffect(() => {
    let cancelled = false;
    let timer;

    const shareStory = async (card, id) => {
      const title = card.querySelector("h3")?.textContent?.trim() || `SSF Impact Story ${id}`;
      const summary = card.querySelector("p.text-zinc-700")?.textContent?.trim() || "SSF Impact Story";
      const image = card.querySelector("img")?.src || "";
      const url = `${SITE_URL}/Blog#story-${id}`;
      const text = `SSF | ${title}\n\n${summary}`;

      if (navigator.share) {
        try {
          if (image) {
            const response = await fetch(image, { cache: "no-cache" });
            if (response.ok) {
              const blob = await response.blob();
              const mime = blob.type || "image/jpeg";
              const extension = mime.includes("png") ? "png" : "jpg";
              const file = new File([blob], `SSF-Story-${id}.${extension}`, { type: mime });
              if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                  title: `SSF | ${title}`,
                  text: `${text}\n\n${url}`,
                  files: [file],
                });
                return;
              }
            }
          }

          await navigator.share({ title: `SSF | ${title}`, text, url });
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const setup = () => {
      if (cancelled) return;

      const readMoreButtons = Array.from(document.querySelectorAll("main button")).filter((button) => {
        const label = button.textContent?.trim() || "";
        return label.includes("Read More") || label.includes("और पढ़ें");
      });

      readMoreButtons.forEach((readMoreButton, index) => {
        const card = readMoreButton.closest(".bg-white.text-black.rounded-2xl");
        if (!card || card.querySelector("[data-blog-share]") || !card.querySelector("img")) return;

        const shareButton = document.createElement("button");
        shareButton.type = "button";
        shareButton.setAttribute("data-blog-share", "true");
        shareButton.setAttribute("aria-label", `Share story ${index + 1}`);
        shareButton.className = "ml-4 inline-flex items-center gap-2 rounded-full border-2 border-[#fb8500] px-4 py-2 text-sm font-semibold text-[#002344] transition hover:bg-[#fb8500] hover:text-white";
        shareButton.innerHTML = '<span aria-hidden="true">↗</span><span>Share Story</span>';
        shareButton.addEventListener("click", () => shareStory(card, index + 1));

        readMoreButton.parentElement?.appendChild(shareButton);
      });

      const hashMatch = window.location.hash.match(/^#story-(\d+)$/);
      if (hashMatch) {
        const storyIndex = Number(hashMatch[1]) - 1;
        const target = readMoreButtons[storyIndex];
        if (target && !target.dataset.hashOpened) {
          target.dataset.hashOpened = "true";
          window.setTimeout(() => target.click(), 120);
        }
      }
    };

    timer = window.setTimeout(setup, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return children;
}
