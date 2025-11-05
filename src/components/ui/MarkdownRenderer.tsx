"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const components: Components = {
    // Headings with gradient text and proper hierarchy
    h1: ({ children, ...props }) => (
      <h1
        className="mb-8 mt-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400 sm:text-5xl"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mb-6 mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:text-4xl"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl"
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5
        className="mb-3 mt-5 text-lg font-semibold text-gray-800 dark:text-gray-200 sm:text-xl"
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6
        className="mb-2 mt-4 text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-lg"
        {...props}
      >
        {children}
      </h6>
    ),

    // Paragraphs with good line-height and readability
    p: ({ children, ...props }) => (
      <p className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </p>
    ),

    // Strong and emphasis
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </em>
    ),

    // Links with gradient underline on hover
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="group relative inline text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full dark:from-blue-400 dark:to-purple-400" />
      </a>
    ),

    // Lists with proper indentation
    ul: ({ children, ...props }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Blockquotes with left border and background
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 border-l-4 border-blue-500 bg-blue-50/50 py-3 pl-6 pr-4 italic text-gray-700 dark:border-blue-400 dark:bg-blue-950/20 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code blocks with dark background
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className={`block rounded-lg bg-gray-900 p-4 text-sm font-mono text-gray-100 overflow-x-auto ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre className="my-6 overflow-x-auto rounded-lg" {...props}>
        {children}
      </pre>
    ),

    // Tables with borders and striped rows
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-300 border border-gray-300 dark:divide-gray-700 dark:border-gray-700"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-100 dark:bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="even:bg-gray-50 dark:even:bg-gray-900/30" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </td>
    ),

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr
        className="my-8 border-t-2 border-gray-200 dark:border-gray-800"
        {...props}
      />
    ),
  };

  return (
    <article className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
