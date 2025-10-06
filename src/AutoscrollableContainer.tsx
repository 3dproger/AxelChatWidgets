import { ArrowDownOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { isWindowScrollAtBottom } from "./Utils/WindowUtils";

interface ScrollableContainerProps {
    children: React.ReactNode;
    maxHeight?: string;
    autoscrollEnabledInitially?: boolean;
}

export function AutoscrollableContainer({ children, maxHeight, autoscrollEnabledInitially }: ScrollableContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoscrollEnabled, setAutoscrollEnabled] = useState<boolean>(autoscrollEnabledInitially ?? true);
    const [lastElement, setLastElement] = useState<HTMLDivElement | null>();
    const lastScrollY = useRef(0);

    const scrollToBottom = useCallback(() => {
        setAutoscrollEnabled(true);
        if (lastElement) {
            lastElement.scrollIntoView({ behavior: "smooth" });
        }
        else {
            console.warn("No last element")
        }
    }, [lastElement]);

    useEffect(() => {
        if (autoscrollEnabled) {
            scrollToBottom();
        }
    }, [lastElement, autoscrollEnabled, children, scrollToBottom]);

    const handleScroll = (event: Event) => {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY.current;

        if (isWindowScrollAtBottom(5)) {
            setAutoscrollEnabled(true);
        }
        else {
            if (scrollDelta < 0) {
                setAutoscrollEnabled(false);
            }
        }

        lastScrollY.current = scrollY;
	};

  window.addEventListener('scroll', handleScroll);

    const style: React.CSSProperties = {
        overflowY: 'auto',
        maxHeight: maxHeight,
    };

    return (
        <div
            ref={containerRef}
            style={style}
            >
            {children}

            <div
                style={{ float: "left", clear: "both" }}
                ref={(element) => {
                    setLastElement(element);
                }}
            />

            {!autoscrollEnabled && 
                <FloatButton onClick={scrollToBottom} icon={<ArrowDownOutlined />} type="primary" style={{ insetInlineEnd: "50%" }} />
            }
        </div>
    );
};
