import { useCallback, useEffect, useRef } from 'react'
import { useState } from 'react'

export default function CopyBtn({ generatedContent }) {
    const copybtnRef = useRef(null)

    const validateContent = (content) => {
        if (typeof content !== 'string') {
            throw new Error('Content must be a valid string');
        }
        return content.length > 2255 ? content.substring(0, 2255) : content;
    }

    const copyContent = useCallback(() => {
        const validContent = validateContent(generatedContent);

        copybtnRef.current.classList.add("bg-blue-700");
        copybtnRef.current.innerHTML = "copied"

        window.navigator.clipboard.writeText(validContent)
    }, [generatedContent])

    useEffect(() => {
        copybtnRef.current.classList.add("bg-blue-500");
        copybtnRef.current.innerHTML = "copy"
    }, [generatedContent])

    return (
        <>
            <button
                type="button"   
                onClick={copyContent}
                className='outline-none bg-blue-500 text-white px-3 py-1 shrink-0'
                ref={copybtnRef}
            >
                copy
            </button>
        </>
    )
}