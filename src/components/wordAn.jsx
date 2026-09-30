import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function WordAni() {
    const listRef = useRef(null);

    useEffect(() => {
        const slides = listRef.current.children;
        const lineHeight = 50;
        const duration = 15;
        const totalSlides = slides.length;

        const tl = gsap.timeline({ repeat: -1, paused: true });

        Array.from(slides).forEach((_, i) => {
            tl.to(
                listRef.current,
                {
                    y: i * -lineHeight,
                    ease: "elastic.out(1, 0.4)",
                    duration: duration / totalSlides
                },
                "+=0"
            );
        });

        tl.play();
    }, []);

    return (
        <div className="p-2">
            <div className="flex">
                <div className="border border-[#003366] md:h-[50px] h-11 overflow-hidden text-center bg-[#003366] inline-block px-2 md:py-0">
                    <ul ref={listRef} className="list-none p-0">
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Change</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Hope</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Lives</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Futures</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Communities</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Dreams</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Voices</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Growth</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Impact</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Smiles</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Possibilities</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Tomorrow</li>
                        <li className="md:text-[38px] text-[27px] leading-[50px] text-[#edf0f3]">Progress</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
