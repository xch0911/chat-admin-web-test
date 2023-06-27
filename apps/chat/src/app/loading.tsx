import { useEffect } from "react";
import { Loading as LoadingComponents } from "@/components/loading";

export default function Loading() {
    useEffect(() => {
        const circles = document.querySelectorAll('circle[attributeName="r"]');
        for (let i = 0; i < circles.length; i++) {
            circles[i].setAttribute('begin', '0s');
        }
    }, []);
  return <LoadingComponents />;
}
