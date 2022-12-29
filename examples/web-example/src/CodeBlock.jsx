import { useEffect, useRef } from "react";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const CodeBlock = ({
    code = '',
    lang 
}) => {
    const ref = useRef()
    useEffect(() => {
        hljs.highlightElement(ref.current)
    }, [code, lang])

    return (
        <pre className={`language-${lang}`}>
            <code ref={ref}>{code}</code>
        </pre>
    )
};

export default CodeBlock