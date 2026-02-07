import React, { useRef, useEffect, useState } from 'react';
import { ForgePanelProps } from '../../types';
import Tooltip from '../Tooltip';
import { CopyIcon, DownloadIcon, ExportIcon, SuccessIcon } from '../icons';

// Let TypeScript know that hljs is available globally
declare const hljs: any;

/**
 * A custom hook to debounce a value. It will only update the returned value
 * after a specified delay has passed without the source value changing.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect only if value or delay changes

  return debouncedValue;
}


const ForgePanel: React.FC<ForgePanelProps> = ({
    promptOutput,
    tokenCount,
    outputMode,
    isDownloaded,
    handlePromptOutputChange,
    copyToClipboard,
    downloadOutput,
    handleExportClick,
}) => {
    const codeRef = useRef<HTMLElement | null>(null);
    const preRef = useRef<HTMLPreElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Debounce the prompt output with a 300ms delay to prevent highlighting on every keystroke.
    const debouncedPromptOutput = useDebounce(promptOutput, 300);

    useEffect(() => {
        // This effect will now only run when the debounced value changes,
        // preventing the expensive highlight operation from blocking the main thread during typing.
        if ((outputMode === 'json' || outputMode === 'xml') && codeRef.current && typeof hljs !== 'undefined') {
            hljs.highlightElement(codeRef.current);
        }
    }, [debouncedPromptOutput, outputMode]);

    const handleScroll = () => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const showHighlightedEditor = (outputMode === 'json' || outputMode === 'xml') && promptOutput;

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-3">
                    <span>2. The Forge</span>
                </h2>
                <div className="flex items-center gap-4">
                    <Tooltip text="Estimated token count. One token is roughly 4 characters.">
                        <span className="text-sm text-gray-400 font-mono cursor-help">
                            Tokens: {tokenCount}
                        </span>
                    </Tooltip>
                </div>
            </div>
            <div className="flex-grow bg-gray-900 rounded-lg p-2 border border-gray-700 min-h-[400px] relative">
                {showHighlightedEditor ? (
                    <>
                        <textarea
                            ref={textareaRef}
                            id="prompt-output-editor"
                            value={promptOutput}
                            onChange={(e) => handlePromptOutputChange(e.target.value)}
                            onScroll={handleScroll}
                            className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-white text-sm leading-relaxed p-4 border-0 focus:outline-none focus:ring-0 resize-none font-mono z-10"
                            placeholder="Your instruction set will be forged here..."
                            spellCheck="false"
                        />
                        <pre 
                            ref={preRef} 
                            className="w-full h-full m-0 p-4 text-sm leading-relaxed overflow-auto font-mono pointer-events-none"
                            aria-hidden="true"
                        >
                            <code
                                ref={codeRef}
                                className={`language-${outputMode}`}
                            >
                                {promptOutput}
                            </code>
                        </pre>
                    </>
                ) : (
                     <textarea
                        id="prompt-output-editor"
                        value={promptOutput}
                        onChange={(e) => handlePromptOutputChange(e.target.value)}
                        className="w-full h-full bg-transparent text-gray-300 text-sm leading-relaxed p-4 border-0 focus:outline-none focus:ring-0 resize-none"
                        placeholder="Your instruction set will be forged here... Fill out the form and click 'Assemble in Forge' to begin."
                    ></textarea>
                )}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={copyToClipboard} className="w-full bg-gray-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <CopyIcon />
                    <span>Copy</span>
                </button>
                <button 
                    onClick={downloadOutput} 
                    className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isDownloaded ? 'bg-green-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-green-600'}`}
                    disabled={isDownloaded || !promptOutput}
                >
                    {isDownloaded ? <SuccessIcon /> : <DownloadIcon />}
                    <span>{isDownloaded ? 'Downloaded' : `Download`}</span>
                </button>
                <button onClick={handleExportClick} className="w-full bg-gray-700 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <ExportIcon />
                    <span>Export to Library</span>
                </button>
            </div>
        </>
    );
};

export default ForgePanel;