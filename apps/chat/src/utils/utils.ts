import { showToast } from "@/components/ui-lib";
import Locale from "@/locales";

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？、,.!?]*$/, "");
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then((res) => {
      showToast(Locale.Copy.Success);
    })
    .catch((err) => {
        // 创建text area
        const textArea = document.createElement('textarea')
        textArea.value = text
        // 使text area不在viewport，同时设置不可见
        document.body.appendChild(textArea)
        // textArea.focus()
        textArea.select()
        return new Promise<void>((resolve, reject) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? resolve() : reject(new Error('出错了'))
            textArea.remove()
        })
        .then(() => {
            showToast(Locale.Copy.Success);
        })
        .catch(() => {
            showToast(Locale.Copy.Failed);
        });
    });
}

export function downloadAs(text: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function isMobileScreen() {
  return window.innerWidth <= 600;
}

export function selectOrCopy(el: HTMLElement, content: string) {
  const currentSelection = window.getSelection();

  if (currentSelection?.type === "Range") {
    return false;
  }

  copyToClipboard(content);

  return true;
}

export function queryMeta(key: string, defaultValue?: string): string {
  let ret: string;
  if (document) {
    const meta = document.head.querySelector(
      `meta[name='${key}']`
    ) as HTMLMetaElement;
    ret = meta?.content ?? "";
  } else {
    ret = defaultValue ?? "";
  }

  return ret;
}
