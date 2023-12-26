import rangeParser from 'parse-numeric-range';
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import ScrollToBottom from 'react-scroll-to-bottom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import elixir from 'react-syntax-highlighter/dist/cjs/languages/prism/elixir';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('elixir', elixir);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);

const MarkdownComponents: Components = {
  // https://amirardalan.com/blog/syntax-highlight-code-in-markdown
  code({ node, className, ...props }) {
    const syntaxTheme = oneDark;
    const hasLang = /language-(\w+)/.exec(className || '');
    const meta = (node?.data as any)?.meta;

    const applyHighlights: object = (applyHighlights: number) => {
      if (meta) {
        const RE = /{([\d,-]+)}/;
        const metadata = meta?.replace(/\s/g, '');
        const strLineNumbers = RE?.test(metadata)
          ? RE?.exec(metadata)![1]
          : '0';
        const highlightLines = rangeParser(strLineNumbers);
        const highlight = highlightLines;
        const data = highlight.includes(applyHighlights) ? 'highlight' : null;
        return { data };
      } else {
        return {};
      }
    };

    return hasLang ? (
      <SyntaxHighlighter
        style={syntaxTheme}
        language={hasLang[1]}
        PreTag="div"
        className="codeStyle"
        showLineNumbers={true}
        wrapLines={!meta}
        useInlineStyles={true}
        lineProps={applyHighlights}
      >
        {props.children as string}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    );
  }
};

export const Message = ({
  role,
  children,
  content
}: {
  role: 'assistant' | 'user';
  children: React.ReactNode;
  content: string;
}) => {
  return (
    <div
      className={`${
        role === 'assistant'
          ? 'justify-self-start bg-background'
          : 'justify-self-end bg-accent'
      } max-w-[75%] rounded-2xl p-4 `}
    >
      <ReactMarkdown className="prose" components={MarkdownComponents}>
        {/* {children} */}
        {content}
      </ReactMarkdown>
    </div>
  );
};
