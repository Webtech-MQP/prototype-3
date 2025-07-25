'use client';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactRough, { Rectangle } from 'rough-react-wrapper';

interface MessyTagProps {
    children: string | ReactNode;
    color?: string;
    style?: CSSProperties;
    className?: string;
    textClassName?: string;
    textStyles?: CSSProperties;
}
export const MessyTag = (props: MessyTagProps) => {
    const labelRef = useRef<HTMLParagraphElement>(null);
    const [dim, setDim] = useState<{ x: number; y: number }>({
        x: typeof props.children === 'string' ? props.children.length * 8 : 20,
        y: 20,
    });

    useEffect(() => {
        const boxModel = labelRef.current?.getBoundingClientRect();
        if (boxModel) {
            setDim({ x: boxModel.width, y: boxModel.height });
        }
    }, [props.children, props.textClassName, props.textStyles]);

    return (
        <div
            style={{
                color: props.color,
                width: 'fit-content',
                transform: `translate(5px, 5px)`,
                ...props.style,
            }}
            className={props.className}
        >
            <div
                style={{
                    position: 'relative',
                }}
            >
                <p
                    ref={labelRef}
                    style={{
                        position: 'absolute',
                        textWrap: 'nowrap',
                        padding: '8px',
                        ...props.textStyles,
                    }}
                    className={props.textClassName}
                >
                    {props.children}
                </p>
            </div>
            <div style={{ transform: `translate(-5px, -5px)` }}>
                {/* @ts-expect-error this can have children.. weird type issue */}
                <ReactRough
                    renderer={'svg'}
                    width={dim.x + 10}
                    height={dim.y + 10}
                >
                    <Rectangle
                        width={dim.x}
                        height={dim.y}
                        x={5}
                        y={5}
                        stroke={props.color || 'white'}
                        strokeWidth={0.8}
                        roughness={3}
                        simplification={0.5}
                        maxRandomnessOffset={1.75}
                    />
                </ReactRough>
            </div>
        </div>
    );
};
