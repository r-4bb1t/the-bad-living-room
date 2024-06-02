"use client";

import { Button, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Share() {
  const { addToast } = useAlert();
  const handleShareURL = () => {
    navigator.share({
      url: window.location.href,
      text: "당신을 의상한거실로 초대합니다.",
    });
  };

  const handleCopyClick = async () => {
    try {
      if (navigator.clipboard)
        await navigator.clipboard.writeText(window.location.href);
      else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        addToast({
          type: "success",
          text: "현재 링크가 복사되었습니다.",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="fixed max-w-md w-full top-0 z-20 h-16 pointer-events-none">
      <div className="w-full h-full flex justify-end px-6 items-center">
        {navigator && typeof navigator?.share === "function" ? (
          <Button
            square
            onClick={handleShareURL}
            ghost
            sz="sm"
            className="pointer-events-auto"
            icon="Share"
          />
        ) : (
          <Button
            square
            onClick={handleCopyClick}
            ghost
            sz="sm"
            className="pointer-events-auto"
            icon="Copy"
          />
        )}
      </div>
    </div>
  );
}
